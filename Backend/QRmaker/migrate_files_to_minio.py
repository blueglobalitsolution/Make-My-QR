#!/usr/bin/env python
"""
Migration script to upload local files to MinIO
Run: docker exec docker-production_backend_1 python manage.py shell < migrate_files_to_minio.py
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "QRmaker.settings")
django.setup()

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from files.models import File
from folders.models import Folder
from django.contrib.auth.models import User

LOCAL_MEDIA_PATH = "/app/media/user_files"


def migrate_files():
    print(f"Scanning local files at: {LOCAL_MEDIA_PATH}")

    # Get or create a default folder and user for migrated files
    try:
        # Try to get user ID 1 or first user
        user = User.objects.first()
        if not user:
            print("No users found. Creating a default user...")
            user = User.objects.create_user(
                "migrated_user", "migrated@example.com", "migrated_pass"
            )
    except Exception as e:
        print(f"Error getting user: {e}")
        return

    # Get or create root folder
    folder, _ = Folder.objects.get_or_create(
        user=user, is_root=True, defaults={"name": user.username}
    )

    files_migrated = 0
    errors = []

    # Walk through local media directory
    local_path = Path(LOCAL_MEDIA_PATH)
    if not local_path.exists():
        print(f"Local path does not exist: {LOCAL_MIGRATED_PATH}")
        # Try the mounted path
        local_path = Path("/app/media/user_files")

    print(f"Looking in: {local_path}")

    for root, dirs, files in os.walk(local_path):
        for filename in files:
            if filename.startswith("."):
                continue

            local_file_path = os.path.join(root, filename)
            relative_path = os.path.relpath(local_file_path, local_path.parent)

            try:
                # Read file content
                with open(local_file_path, "rb") as f:
                    file_content = f.read()

                # Determine file type
                ext = os.path.splitext(filename)[1].lower().replace(".", "")

                # Create ContentFile
                content_file = ContentFile(file_content, name=relative_path)

                # Save to MinIO
                saved_path = default_storage.save(relative_path, content_file)

                # Get file size
                file_size = len(file_content)

                # Create database record
                file_obj, created = File.objects.get_or_create(
                    name=filename,
                    user=user,
                    folder=folder,
                    defaults={
                        "file": saved_path,
                        "file_type": ext,
                        "size": file_size,
                    },
                )

                if created:
                    print(f"✓ Migrated: {filename} -> {saved_path}")
                    files_migrated += 1
                else:
                    print(f"  Already exists: {filename}")

            except Exception as e:
                error_msg = f"Error migrating {filename}: {str(e)}"
                print(f"✗ {error_msg}")
                errors.append(error_msg)

    print(f"\n{'=' * 50}")
    print(f"Migration complete!")
    print(f"Files migrated: {files_migrated}")
    print(f"Errors: {len(errors)}")

    if errors:
        print("\nErrors:")
        for err in errors:
            print(f"  - {err}")


if __name__ == "__main__":
    migrate_files()
