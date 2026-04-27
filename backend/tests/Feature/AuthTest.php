<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use DatabaseTransactions;

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Inserta un usuario de prueba directamente en la BD y devuelve sus datos.
     */
    private function crearUsuarioPrueba(array $override = []): array
    {
        $data = array_merge([
            'nombre'   => 'Usuario Test',
            'email'    => 'test_' . uniqid() . '@test.com',
            'password' => 'password123',
            'rol'      => 'colaborador',
            'estado'   => 'activo',
        ], $override);

        DB::select('CALL sp_registrar(?, ?, ?)', [
            $data['nombre'],
            $data['email'],
            Hash::make($data['password']),
        ]);

        return $data;
    }

    // Registro

    public function test_registro_exitoso(): void
    {
        $response = $this->postJson('/api/registrar', [
            'nombre'   => 'Nuevo Usuario',
            'email'    => 'nuevo_' . uniqid() . '@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'user_id']);
    }

    public function test_registro_falla_sin_nombre(): void
    {
        $response = $this->postJson('/api/registrar', [
            'email'    => 'alguien@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(400);
    }

    public function test_registro_falla_con_email_duplicado(): void
    {
        $usuario = $this->crearUsuarioPrueba();

        $response = $this->postJson('/api/registrar', [
            'nombre'   => 'Otro Nombre',
            'email'    => $usuario['email'],
            'password' => 'password123',
        ]);

        $response->assertStatus(400);
    }

    public function test_registro_falla_con_password_corta(): void
    {
        $response = $this->postJson('/api/registrar', [
            'nombre'   => 'Usuario',
            'email'    => 'short_' . uniqid() . '@test.com',
            'password' => '123',
        ]);

        $response->assertStatus(400);
    }

    // Login

    public function test_login_exitoso(): void
    {
        $usuario = $this->crearUsuarioPrueba();

        $response = $this->postJson('/api/login', [
            'email'    => $usuario['email'],
            'password' => $usuario['password'],
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'access_token',
                     'token_type',
                     'user' => ['id', 'nombre', 'email', 'rol'],
                 ]);
    }

    public function test_login_falla_con_email_inexistente(): void
    {
        $response = $this->postJson('/api/login', [
            'email'    => 'noexiste@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_falla_con_password_incorrecta(): void
    {
        $usuario = $this->crearUsuarioPrueba();

        $response = $this->postJson('/api/login', [
            'email'    => $usuario['email'],
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_falla_sin_credenciales(): void
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(400);
    }

    // Recuperar contraseña

    public function test_olvide_password_con_email_valido(): void
    {
        $usuario = $this->crearUsuarioPrueba();

        $response = $this->postJson('/api/olvide-password', [
            'email' => $usuario['email'],
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'reset_token']);
    }

    public function test_olvide_password_falla_sin_email(): void
    {
        $response = $this->postJson('/api/olvide-password', []);

        $response->assertStatus(400);
    }
}
