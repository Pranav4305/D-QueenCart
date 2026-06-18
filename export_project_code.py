import os

ROOT_DIR = os.getcwd()
OUTPUT_FILE = "chronoforensics_project_export.txt"

# File types to export
INCLUDE_EXTENSIONS = (
    ".py",
    ".html",
    ".js",
    ".css",
    ".json",
    ".txt",
    ".md"
)

# Folders to skip
IGNORE_FOLDERS = {
    "__pycache__",
    ".git",
    ".venv",
    "venv",
    "node_modules"
}


def export_project():

    with open(OUTPUT_FILE, "w", encoding="utf-8") as output:

        for root, dirs, files in os.walk(ROOT_DIR):

            # Skip unwanted folders
            dirs[:] = [d for d in dirs if d not in IGNORE_FOLDERS]

            for file in sorted(files):

                if not file.endswith(INCLUDE_EXTENSIONS):
                    continue

                full_path = os.path.join(root, file)

                # Make path relative
                relative_path = os.path.relpath(full_path, ROOT_DIR)

                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()

                    output.write(f"{relative_path}:\n")
                    output.write(content)
                    output.write("\n\n")
                    output.write("=" * 80)
                    output.write("\n\n")

                except Exception as e:
                    output.write(f"{relative_path}: ERROR READING FILE\n{e}\n\n")

    print(f"\n✅ Project exported successfully to:\n{OUTPUT_FILE}\n")


if __name__ == "__main__":
    export_project()