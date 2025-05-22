
#  Contributing Guidelines

Thank you for your interest in contributing to this project! 🎉  
This site uses the **Chirpy Jekyll Theme** and is open to contributions, especially in the form of new posts and author additions.

Please follow these guidelines to ensure smooth collaboration.

---

##  Prerequisites

- Basic knowledge of Markdown and Git.
- [Jekyll](https://jekyllrb.com/docs/installation/) installed on your local machine to preview the site locally.
- Fork this repository and create a new branch for your changes.

---

##  Adding a New Post

To contribute a blog post:

1. **Create the Post File:**
   - Add your post to the `_posts/` directory.
   - Use the format: `YYYY-MM-DD-title.md` (e.g., `2025-05-22-my-first-post.md`).

2. **Front Matter Example:**

   ```yaml
   ---
   title: "Your Post Title"
   date: 2025-05-22 10:00:00 +0000
   categories: [Category]
   tags: [tag1, tag2]
   author: your-github-username
   ---
   ```

3. **Write in Markdown:**
   - Use standard Markdown syntax.
   - Include images or assets in the `/assets/img/` directory and reference them in your post.
   - Use proper headings, code blocks, and links.

4. **Preview Locally (Optional):**

   ```bash
   bundle install
   bundle exec jekyll serve
   ```

   Then open [http://localhost:4000](http://localhost:4000) in your browser.

---

##  Adding Yourself as an Author

1. Open `_data/authors.yml`.
2. Add a new entry like the following:

   ```yaml
   your-github-username:
     name: Your Name
     bio: "A short bio about you."
     avatar: "/assets/img/your-photo.jpg" # Optional
     url: "https://yourwebsite.com" # Optional
   ```

3. Upload your avatar image to `/assets/img/` if used.

---

##  Pull Request Checklist

- [ ] Added a valid post file with proper front matter.
- [ ] Updated `_data/authors.yml` (if you're a new contributor).
- [ ] Verified formatting and spelling.
- [ ] Post renders correctly in local Jekyll preview (optional but recommended).
- [ ] Commit message is descriptive (e.g., `Add post: My Journey into Open Source`).

---

##  What Not to Do

- Don’t modify other authors’ posts without discussion.
- Avoid including unrelated changes in your PR.
- Don’t commit large files (>5MB) unless necessary.

---

##  Submitting

Once you're ready:

1. Push your branch.
2. Open a pull request.
3. Add a brief description of your contribution.

We’ll review your submission and provide feedback or merge it in!

---

**Thanks for contributing to our project!** 
For any questions, feel free to open an issue or start a discussion.
