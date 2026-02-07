<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use Illuminate\Http\Request;


class TodoController extends Controller
{


    public function index(Request $request)
    {
        $query = $request->user()
            ->todos();

        if ($request->has('completed')) {
            $query->where('completed', $request->boolean('completed'));
        }

        //default
        $sort = $request->get('sort', 'updated_at');
        $order = $request->get('order', 'desc');

        // whitelist allowed sort
        if (in_array($sort, ['created_at', 'updated_at'])) {
            $query->orderBy($sort, $order === 'asc' ? 'asc' : 'desc');
        }

        $todos = $query->get();

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
//        $this->authorize('create', Todo::class);

        $todo = $request->user()->todos()->create([
            'title' => $request->title,
            'description' => $request->description,
            'completed' => false,
        ]);

        return new TodoResource($todo);

    }

}
