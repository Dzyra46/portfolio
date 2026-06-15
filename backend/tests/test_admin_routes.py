from uuid import UUID

def test_create_project(client):
    response = client.post(
        "/api/v1/admin/projects",
        json={
            "title": "Test Project",
            "slug": "test-project",
            "is_published": False,
            "featured": False,
            "sort_order": 0
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Project"
    assert "id" in data

def test_soft_delete_project(client):
    # Create project
    response = client.post(
        "/api/v1/admin/projects",
        json={
            "title": "Test Project 2",
            "slug": "test-project-2",
        }
    )
    assert response.status_code == 201
    project_id = response.json()["id"]

    # Delete project
    delete_res = client.delete(f"/api/v1/admin/projects/{project_id}")
    assert delete_res.status_code == 204

    # Verify it doesn't appear in list
    list_res = client.get("/api/v1/admin/projects")
    assert list_res.status_code == 200
    items = list_res.json()
    assert len(items) == 0

def test_upload_file_size_limit(client):
    # Create a 6MB dummy file
    dummy_content = b"0" * (6 * 1024 * 1024)
    response = client.post(
        "/api/v1/admin/upload",
        files={"file": ("test.png", dummy_content, "image/png")}
    )
    assert response.status_code == 400
    assert "too large" in response.json()["detail"]

def test_upload_invalid_mime(client):
    dummy_content = b"dummy text"
    response = client.post(
        "/api/v1/admin/upload",
        files={"file": ("test.txt", dummy_content, "text/plain")}
    )
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]

def test_contact_messages_pagination(client, db_session):
    from app.models.contact_messages import ContactMessage
    import uuid
    # Insert 30 messages
    for i in range(30):
        msg = ContactMessage(
            name=f"User {i}",
            email=f"user{i}@test.com",
            message="Hello",
            status="unread"
        )
        db_session.add(msg)
    db_session.commit()

    res = client.get("/api/v1/admin/messages?limit=10&offset=0")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 30
    assert len(data["items"]) == 10
    assert data["limit"] == 10
    assert data["offset"] == 0
