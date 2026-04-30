#!/usr/bin/env python3
"""Apply viewer-enforced copy/edit restrictions to public PDFs."""

from __future__ import annotations

import argparse
from pathlib import Path
from secrets import token_urlsafe
import sys

try:
    from pypdf import PdfReader, PdfWriter
    from pypdf.constants import UserAccessPermissions as Perm
except ImportError as exc:
    raise SystemExit(
        "Missing Python dependency: pypdf. Install it with `python -m pip install pypdf`."
    ) from exc


DEFAULT_PUBLIC_DIR = Path("public")
ALLOWED_PERMISSIONS = Perm.PRINT | Perm.PRINT_TO_REPRESENTATION
BLOCKED_PERMISSIONS = (
    Perm.MODIFY
    | Perm.EXTRACT
    | Perm.ADD_OR_MODIFY
    | Perm.FILL_FORM_FIELDS
    | Perm.EXTRACT_TEXT_AND_GRAPHICS
    | Perm.ASSEMBLE_DOC
)


def can_open_without_password(reader: PdfReader) -> bool:
    if not reader.is_encrypted:
        return True

    return reader.decrypt("") != 0


def is_secured(reader: PdfReader) -> bool:
    if not reader.is_encrypted:
        return False

    permissions = reader.user_access_permissions
    allows_printing = (permissions & ALLOWED_PERMISSIONS) == ALLOWED_PERMISSIONS
    blocks_copying_and_editing = (permissions & BLOCKED_PERMISSIONS) == 0
    return allows_printing and blocks_copying_and_editing


def secure_pdf(path: Path) -> bool:
    reader = PdfReader(str(path))
    if not can_open_without_password(reader):
        raise RuntimeError(f"{path} cannot be opened with an empty user password.")

    if is_secured(reader):
        print(f"ok: {path}")
        return False

    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    if reader.metadata:
        writer.add_metadata(dict(reader.metadata))

    writer.encrypt(
        user_password="",
        owner_password=token_urlsafe(32),
        permissions_flag=ALLOWED_PERMISSIONS,
        algorithm="AES-256",
    )

    temp_path = path.with_suffix(".secured.tmp.pdf")
    with temp_path.open("wb") as handle:
        writer.write(handle)

    temp_path.replace(path)
    print(f"secured: {path}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Secure public PDFs while keeping them openable without a password."
    )
    parser.add_argument(
        "public_dir",
        nargs="?",
        type=Path,
        default=DEFAULT_PUBLIC_DIR,
        help=f"Directory containing static site assets. Defaults to {DEFAULT_PUBLIC_DIR}.",
    )
    args = parser.parse_args()

    if not args.public_dir.exists():
        print(f"No public asset directory found: {args.public_dir}")
        return 0

    pdfs = sorted(args.public_dir.rglob("*.pdf"))
    if not pdfs:
        print(f"No public PDFs found in {args.public_dir}")
        return 0

    changed = 0
    for pdf in pdfs:
        changed += int(secure_pdf(pdf))

    print(f"Processed {len(pdfs)} PDF(s); secured {changed} new or updated PDF(s).")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
