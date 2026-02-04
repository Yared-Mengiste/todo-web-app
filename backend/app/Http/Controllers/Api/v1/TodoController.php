<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class TodoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum'); // ensure user is authenticated
    }

    public function index(Request $request)
    {
        $todos = $request->user()
            ->todos()
            ->latest()
            ->get();
        return TodoResource::collection($todos);
    }


    public function update(UpdateTodoRequest $request, Todo $todo)
    {
        $this->authorize('update', $todo); // action-specific
        $todo->update($request->only(['title', 'description', 'completed']));
        return new TodoResource($todo);
    }

    public function destroy(Todo $todo)
    {
        $this->authorize('delete', $todo); // action-specific
        $todo->delete();
        return response()->noContent();
    }

    public function show(Todo $todo)
    {
        $this->authorize('view', $todo);
        return new TodoResource($todo);

    }

    public function store(StoreTodoRequest $request)
    {
        $this->authorize('create', Todo::class);

        $todo = $request->user()->todos()->create([
            'title' => $request->title,
            'description' => $request->description,
            'completed' => false, // optional default
        ]);

        return new TodoResource($todo);

    }

}
