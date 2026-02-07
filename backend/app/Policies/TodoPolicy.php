<?php

namespace App\Policies;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TodoPolicy
{
    public function view(User $user, Todo $todo)
    {
        return $todo->user_id === $user->id;
    }

    public function update(User $user, Todo $todo)
    {
        return $todo->user_id === $user->id;
    }

    public function delete(User $user, Todo $todo)
    {
        return $todo->user_id === $user->id;
    }

    public function create(User $user)
    {
        return true;
    }
}
