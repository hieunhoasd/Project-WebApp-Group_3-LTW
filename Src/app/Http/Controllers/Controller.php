<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all(); 
        
        return view('admin.users.index', compact('users'));
    }


    public function store(Request $request)
    {
       
        $validatedData = $request->validate([
            'name'     => 'required|string|min:3|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'phone'    => 'required|regex:/(0)[0-9]{9}/', 
        ], [

            'name.required'  => 'The full name must not be left blank.',
            'email.required' => 'The email must not be left blank.',
            'email.unique'   => 'This email is already in use.',
            'password.min'   => 'The password must be at least 6 characters.',
            'phone.regex'    => 'The phone number is not in the correct format (e.g., 0912345678).',
        ]);
        
        
        $validatedData['password'] = Hash::make($validatedData['password']);

        User::create($validatedData);

        return redirect()->route('users.index')->with('success', 'Account created successfully!');
    }

   
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validatedData = $request->validate([
            'name'  => 'required|string|min:3|max:255',
            'email' => [
                'required', 'string', 'email', 'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone' => 'required|regex:/(0)[0-9]{9}/',
        ], [
            'name.required'  => 'The full name must not be left blank.',
            'email.required' => 'The email must not be left blank.',
            'email.unique'   => 'This email is already in use.',
            'phone.regex'    => 'The phone number is not in the correct format.',
        ]);

        $user->update($validatedData);

        return redirect()->route('users.index')->with('success', 'Update successful!');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully!');
    }
}
