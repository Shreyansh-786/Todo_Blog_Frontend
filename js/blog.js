// js/blog.js
document.addEventListener("DOMContentLoaded", function () {
    const app = document.getElementById("blog-app");
    app.innerHTML += `
        <form id="blog-form" class="mb-4">
            <input type="hidden" id="blog-id">
            <div class="mb-2">
                <input type="text" id="blog-title" class="form-control" placeholder="Post Title" required>
            </div>
            <div class="mb-2">
                <textarea id="blog-content" rows="4" class="form-control" placeholder="Write your post..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Publish</button>
            <button type="button" class="btn btn-secondary ms-2 d-none" id="blog-cancel">Cancel</button>
        </form>
        <div class="mb-3">
            <input type="text" id="blog-search" class="form-control" placeholder="Search posts...">
        </div>
        <ul id="blog-list" class="list-group mb-3"></ul>
        <div id="blog-view" class="d-none">
            <h3 id="view-title"></h3>
            <div id="view-content" class="mb-3"></div>
            <button class="btn btn-sm btn-outline-secondary" id="view-back">Back</button>
            <button class="btn btn-sm btn-warning ms-2" id="view-edit">Edit</button>
            <button class="btn btn-sm btn-danger ms-2" id="view-delete">Delete</button>
        </div>
        <div id="empty-posts" class="text-muted"></div>
    `;

    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    let searchQuery = "";

    function savePosts() {
        localStorage.setItem("posts", JSON.stringify(posts));
    }

    function renderPosts() {
        const list = document.getElementById("blog-list");
        list.innerHTML = "";
        let filtered = posts.filter(
            p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        filtered.sort((a, b) => b.id - a.id);
        if (!filtered.length) {
            document.getElementById("empty-posts").textContent = "No posts to show.";
            return;
        }
        document.getElementById("empty-posts").textContent = "";
        filtered.forEach(post => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                <div class="post-title fw-bold" data-id="${post.id}" style="cursor:pointer">
                    ${post.title}
                </div>
                <span class="text-muted small">${(new Date(post.id)).toLocaleString()}</span>
            `;
            list.appendChild(li);
        });
    }

    function showView(post) {
        document.getElementById("blog-list").classList.add("d-none");
        document.getElementById("blog-form").classList.add("d-none");
        document.getElementById("blog-search").classList.add("d-none");
        document.getElementById("blog-view").classList.remove("d-none");
        document.getElementById("view-title").textContent = post.title;
        document.getElementById("view-content").textContent = post.content;
        document.getElementById("view-edit").setAttribute("data-id", post.id);
        document.getElementById("view-delete").setAttribute("data-id", post.id);
    }

    function hideView() {
        document.getElementById("blog-list").classList.remove("d-none");
        document.getElementById("blog-form").classList.remove("d-none");
        document.getElementById("blog-search").classList.remove("d-none");
        document.getElementById("blog-view").classList.add("d-none");
    }

    document.getElementById("blog-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const idInput = document.getElementById("blog-id");
        const titleInput = document.getElementById("blog-title");
        const contentInput = document.getElementById("blog-content");
        const editing = idInput.value;
        if (editing) {
            // Edit post
            posts = posts.map(p =>
                p.id == editing
                    ? { ...p, title: titleInput.value.trim(), content: contentInput.value.trim() }
                    : p
            );
        } else {
            // Add new post
            posts.push({
                id: Date.now(),
                title: titleInput.value.trim(),
                content: contentInput.value.trim()
            });
        }
        savePosts();
        renderPosts();
        this.reset();
        document.getElementById("blog-cancel").classList.add("d-none");
        idInput.value = "";
    });

    // Start editing
    document.getElementById("blog-list").addEventListener("click", function (e) {
        if (e.target.classList.contains("post-title")) {
            const post = posts.find(p => p.id == e.target.getAttribute("data-id"));
            showView(post);
        }
    });

    // Search
    document.getElementById("blog-search").addEventListener("input", function (e) {
        searchQuery = this.value;
        renderPosts();
    });

    // Edit in detail view
    document.getElementById("view-edit").addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const post = posts.find(p => p.id == id);
        document.getElementById("blog-id").value = post.id;
        document.getElementById("blog-title").value = post.title;
        document.getElementById("blog-content").value = post.content;
        document.getElementById("blog-cancel").classList.remove("d-none");
        hideView();
    });

    document.getElementById("blog-cancel").addEventListener("click", function () {
        document.getElementById("blog-form").reset();
        document.getElementById("blog-id").value = "";
        this.classList.add("d-none");
    });

    // Delete in detail view
    document.getElementById("view-delete").addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        if (confirm("Delete this post?")) {
            posts = posts.filter(p => p.id != id);
            savePosts();
            hideView();
            renderPosts();
        }
    });

    document.getElementById("view-back").addEventListener("click", function () {
        hideView();
    });

    // Initial render
    renderPosts();
});