from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# in-memory storage for tasks
tasks = []
next_id = 1


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks), 200


@app.route("/api/tasks", methods=["POST"])
def create_task():
    global next_id
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()

    # edge case: empty title
    if not title:
        return jsonify({"error": "Task title cannot be empty"}), 400

    new_task = {
        "id": next_id,
        "title": title,
        "completed": False
    }
    tasks.append(new_task)
    next_id += 1
    return jsonify(new_task), 201


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json(silent=True) or {}

    for task in tasks:
        if task["id"] == task_id:
            if "title" in data:
                new_title = (data.get("title") or "").strip()
                if not new_title:
                    return jsonify({"error": "Task title cannot be empty"}), 400
                task["title"] = new_title
            if "completed" in data:
                task["completed"] = bool(data["completed"])
            return jsonify(task), 200

    # edge case: task not found
    return jsonify({"error": "Task not found"}), 404


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            removed = tasks.pop(i)
            return jsonify(removed), 200

    # edge case: deleting non-existent task
    return jsonify({"error": "Task not found"}), 404


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Task Manager API is running"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5001)
