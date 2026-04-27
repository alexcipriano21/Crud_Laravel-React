<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;

class AuthController extends Controller
{
    public function registrar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $hashedPassword = Hash::make($request->password);

        $resultado = DB::select('CALL sp_registrar(?, ?, ?)', [
            $request->nombre,
            $request->email,
            $hashedPassword
        ]);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user_id' => $resultado[0]->id ?? null
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $resultado = DB::select('CALL sp_login(?)', [$request->email]);

        if (count($resultado) === 0) {
            return response()->json(['error' => 'No existe un usuario con este correo'], 401);
        }

        $usuarioData = $resultado[0];

        if (!Hash::check($request->password, $usuarioData->password)) {
            return response()->json(['error' => 'Contraseña incorrecta'], 401);
        }

        $user = (new User())->forceFill((array) $usuarioData);
        $token = auth('api')->login($user);

        return $this->respondWithToken($token, $user);
    }

    protected function respondWithToken($token, $user)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => [
                'id' => $user->id,
                'nombre' => $user->nombre,
                'email' => $user->email,
                'rol' => $user->rol,
                'estado' => $user->estado,
                'imagen' => $user->imagen,
            ]
        ]);
    }

    public function olvidePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $token = strtoupper(\Illuminate\Support\Str::random(8));

        DB::select('CALL sp_guardarToken(?, ?)', [
            $request->email,
            $token
        ]);

        return response()->json([
            'message' => 'Si el correo existe, el token fue generado',
            'reset_token' => $token
        ]);
    }

    public function actualizarPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $hashedPassword = Hash::make($request->password);

        $resultado = DB::select('CALL sp_actualizarPassword(?, ?, ?)', [
            $request->email,
            $request->token,
            $hashedPassword
        ]);

        $res = $resultado[0]->resultado ?? 'error';

        if ($res === 'success') {
            return response()->json(['message' => 'Contraseña actualizada correctamente']);
        }

        return response()->json(['error' => 'Token inválido o expirado'], 400);
    }

    public function redireccionarGoogle()
    {
        return response()->json([
            'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl()
        ]);
    }

    public function callbackGoogle()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return redirect('http://localhost:3000/login?error=google_failed');
        }
        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'nombre' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'imagen' => $googleUser->getAvatar(),
                'estado' => 'activo',
                'rol' => 'administrador',
                'check_verificado' => true
            ]
        );
        $token = auth('api')->login($user);
        $userData = urlencode(json_encode([
            'id' => $user->id,
            'nombre' => $user->nombre,
            'email' => $user->email,
            'rol' => $user->rol,
            'estado' => $user->estado,
            'imagen' => $user->imagen,
        ]));
        return redirect(
            "http://localhost:3000/login/callback?token={$token}&user={$userData}"
        );
    }

}
