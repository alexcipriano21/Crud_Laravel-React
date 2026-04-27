<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function obtenerUsuarios()
    {
        $usuarios = DB::select('CALL sp_obtenerUsuarios()');
        $usuariosFiltrados = array_filter($usuarios, function ($u) {
            return $u->rol !== 'administrador';
        });
        return response()->json(array_values($usuariosFiltrados));
    }

    public function obtenerUsuario($id)
    {
        $usuario = DB::select('CALL sp_obtenerUsuario(?)', [$id]);
        if (count($usuario) === 0) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
        return response()->json($usuario[0]);
    }

    public function crearUsuario(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'rol' => 'required|string|in:colaborador,editor,supervisor',
            'estado' => 'required|string|in:activo,inactivo,pendiente',
            'imagen' => 'nullable|string',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $hashedPassword = Hash::make($request->password);
        $resultado = DB::select('CALL sp_crearUsuario(?, ?, ?, ?, ?, ?, ?, ?)', [
            $request->nombre,
            $request->email,
            $hashedPassword,
            $request->imagen ?? null,
            $request->rol,
            $request->estado,
            $request->telefono ?? null,
            $request->direccion ?? null
        ]);
        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'id' => $resultado[0]->id ?? null
        ], 201);
    }

    public function actualizarUsuario(Request $request, $id)
    {
        if ($request->boolean('_changePassword')) {
            $validator = Validator::make($request->all(), [
                'password' => 'required|string|min:6',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }
            DB::statement('UPDATE users SET password = ? WHERE id = ?', [
                Hash::make($request->password),
                $id
            ]);
            return response()->json(['message' => 'Contraseña actualizada correctamente']);
        }
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'rol' => 'required|string|in:colaborador,editor,supervisor,administrador',
            'estado' => 'required|string|in:activo,inactivo,pendiente',
            'check_verificado' => 'nullable|boolean',
            'imagen' => 'nullable|string',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        DB::select('CALL sp_actualizarUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            $id,
            $request->nombre,
            $request->email,
            $request->imagen ?? null,
            $request->rol,
            $request->estado,
            $request->check_verificado ? 1 : 0,
            $request->telefono ?? null,
            $request->direccion ?? null
        ]);
        return response()->json(['message' => 'Usuario actualizado correctamente']);
    }

    public function eliminarUsuario($id)
    {
        DB::select('CALL sp_eliminarUsuario(?)', [$id]);
        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }
}
