import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Tasks = () => {
	const { user, logout } = useAuth();
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [editingTaskId, setEditingTaskId] = useState(null);
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const limit = 10;

	useEffect(() => {
		fetchTasks();
	}, [page]);

	const fetchTasks = async () => {
		try {
			setLoading(true);
			const response = await api.get(
				`/tasks?page=${page}&limit=${limit}`
			);
			setTasks(response.data.tasks);
			setTotalPages(response.data.totalPages);
			setTotal(response.data.total);
			setError("");
		} catch (err) {
			setError("Failed to fetch tasks");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateTask = async (e) => {
		e.preventDefault();
		try {
			const response = await api.post("/tasks", { title, description });
			setTasks([response.data, ...tasks]);
			setTitle("");
			setDescription("");
			setError("");
			if (page === 1) {
				fetchTasks();
			} else {
				setPage(1);
			}
		} catch (err) {
			setError(err.response?.data?.error || "Failed to create task");
		}
	};

	const handleUpdateStatus = async (taskId, newStatus) => {
		try {
			const response = await api.put(`/tasks/${taskId}`, {
				status: newStatus,
			});
			setTasks(
				tasks.map((task) =>
					task.id === response.data.id ? response.data : task
				)
			);
			setError("");
		} catch (err) {
			setError(err.response?.data?.error || "Failed to update task");
		}
	};

	const handleEditTask = (task) => {
		setEditingTaskId(task.id);
		setEditTitle(task.title);
		setEditDescription(task.description || "");
	};

	const handleCancelEdit = () => {
		setEditingTaskId(null);
		setEditTitle("");
		setEditDescription("");
	};

	const handleUpdateTask = async (taskId) => {
		try {
			const response = await api.put(`/tasks/${taskId}`, {
				title: editTitle,
				description: editDescription,
			});
			setTasks(
				tasks.map((task) =>
					task.id === response.data.id ? response.data : task
				)
			);
			setEditingTaskId(null);
			setEditTitle("");
			setEditDescription("");
			setError("");
		} catch (err) {
			setError(err.response?.data?.error || "Failed to update task");
		}
	};

	const handleDeleteTask = async (taskId) => {
		if (!window.confirm("Are you sure you want to delete this task?")) {
			return;
		}
		try {
			await api.delete(`/tasks/${taskId}`);
			setTasks(tasks.filter((task) => task.id !== taskId));
			setError("");
			fetchTasks();
		} catch (err) {
			setError(err.response?.data?.error || "Failed to delete task");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Task Management</h1>
					<div className="flex items-center gap-4">
						<span className="text-sm">User: {user?.name}</span>
						<button
							onClick={logout}
							className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
						>
							Logout
						</button>
					</div>
				</div>

				{error && (
					<div className="bg-red-100 text-red-700 p-3 rounded mb-4">
						{error}
					</div>
				)}

				<div className="bg-white rounded shadow p-6 mb-6">
					<h2 className="text-xl font-bold mb-4">Add New Task</h2>
					<form onSubmit={handleCreateTask} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">
								Title *
							</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								className="w-full px-3 py-2 border rounded"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">
								Description
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="w-full px-3 py-2 border rounded"
								rows="3"
							/>
						</div>
						<button
							type="submit"
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						>
							Add Task
						</button>
					</form>
				</div>

				<div className="bg-white rounded shadow p-6">
					<h2 className="text-xl font-bold mb-4">Tasks ({total})</h2>
					{loading ? (
						<div className="text-center py-8">Loading...</div>
					) : tasks.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							No tasks found
						</div>
					) : (
						<>
							<div className="space-y-4">
								{tasks.map((task) => (
									<div
										key={task.id}
										className="border rounded p-4"
									>
										{editingTaskId === task.id ? (
											<div className="space-y-3">
												<div>
													<label className="block text-sm font-medium mb-1">
														Title *
													</label>
													<input
														type="text"
														value={editTitle}
														onChange={(e) =>
															setEditTitle(
																e.target.value
															)
														}
														required
														className="w-full px-3 py-2 border rounded"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium mb-1">
														Description
													</label>
													<textarea
														value={editDescription}
														onChange={(e) =>
															setEditDescription(
																e.target.value
															)
														}
														className="w-full px-3 py-2 border rounded"
														rows="3"
													/>
												</div>
												<div className="flex gap-2">
													<button
														onClick={() =>
															handleUpdateTask(
																task.id
															)
														}
														className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
													>
														Save
													</button>
													<button
														onClick={
															handleCancelEdit
														}
														className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
													>
														Cancel
													</button>
												</div>
											</div>
										) : (
											<>
												<div className="flex justify-between items-start mb-2">
													<h3 className="font-semibold text-lg">
														{task.title}
													</h3>
													<div className="flex gap-2">
														<button
															onClick={() =>
																handleEditTask(
																	task
																)
															}
															className="text-blue-600 hover:text-blue-800"
														>
															Edit
														</button>
														<button
															onClick={() =>
																handleDeleteTask(
																	task.id
																)
															}
															className="text-red-600 hover:text-red-800"
														>
															Delete
														</button>
													</div>
												</div>
												{task.description && (
													<p className="text-gray-600 mb-3">
														{task.description}
													</p>
												)}
												<div className="flex items-center gap-4">
													<select
														value={task.status}
														onChange={(e) =>
															handleUpdateStatus(
																task.id,
																e.target.value
															)
														}
														className="border rounded px-3 py-1"
													>
														<option value="pending">
															Pending
														</option>
														<option value="in_progress">
															In Progress
														</option>
														<option value="done">
															Done
														</option>
													</select>
													<span className="text-sm text-gray-500">
														Created:{" "}
														{new Date(
															task.created_at
														).toLocaleDateString()}
													</span>
												</div>
											</>
										)}
									</div>
								))}
							</div>

							<div className="flex justify-center items-center gap-2 mt-6">
								<button
									onClick={() => setPage(page - 1)}
									disabled={page === 1}
									className="px-4 py-2 border rounded disabled:opacity-50"
								>
									Previous
								</button>
								<span className="px-4">
									Page {page} of {totalPages}
								</span>
								<button
									onClick={() => setPage(page + 1)}
									disabled={page === totalPages}
									className="px-4 py-2 border rounded disabled:opacity-50"
								>
									Next
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Tasks;
