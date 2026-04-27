<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Tests\TestCase;

class UserTest extends TestCase
{
    use DatabaseTransactions;

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Crea un usuario administrador y devuelve su token JWT para autenticarse.
     */
    private function getAdminToken(): string
    {
        $password = 'admin123';
        DB::select('CALL sp_registrar(?, ?, ?)', [
            'Admin Test',
            'admin_' . uniqid() . '@test.com',
            Hash::make($password),
        ]);

        // Recuperamos el último usuario insertado
        $adminData = DB::selectOne('SELECT * FROM users ORDER BY id DESC LIMIT 1');
        $admin = (new User())->forceFill((array) $adminData);

        return auth('api')->login($admin);
    }

    /**
     * Crea un usuario de prueba con el SP y devuelve su ID.
     */
    private function crearUsuario(array $override = []): int
    {
        $data = array_merge([
            'nombre'    => 'User Test',
            'email'     => 'user_' . uniqid() . '@test.com',
            'password'  => 'password123',
            'imagen'    => null,
            'rol'       => 'colaborador',
            'estado'    => 'activo',
            'telefono'  => null,
            'direccion' => null,
        ], $override);

        $result = DB::select('CALL sp_crearUsuario(?, ?, ?, ?, ?, ?, ?, ?)', [
            $data['nombre'],
            $data['email'],
            Hash::make($data['password']),
            $data['imagen'],
            $data['rol'],
            $data['estado'],
            $data['telefono'],
            $data['direccion'],
        ]);

        return $result[0]->id;
    }

    // GET /api/usuarios 

    public function test_obtener_usuarios_con_token(): void
    {
        $token = $this->getAdminToken();

        $response = $this->withToken($token)->getJson('/api/usuarios');

        $response->assertStatus(200)
                 ->assertJsonIsArray();
    }

    public function test_obtener_usuarios_sin_token(): void
    {
        $response = $this->getJson('/api/usuarios');

        $response->assertStatus(401);
    }

    // GET /api/usuarios/{id} 

    public function test_obtener_usuario_por_id(): void
    {
        $token = $this->getAdminToken();
        $id    = $this->crearUsuario();

        $response = $this->withToken($token)->getJson("/api/usuarios/{$id}");

        $response->assertStatus(200)
                 ->assertJsonStructure(['id', 'nombre', 'email', 'rol', 'estado']);
    }

    public function test_obtener_usuario_inexistente(): void
    {
        $token = $this->getAdminToken();

        $response = $this->withToken($token)->getJson('/api/usuarios/999999');

        $response->assertStatus(404);
    }

    // POST /api/usuarios 

    public function test_crear_usuario_exitoso(): void
    {
        $token = $this->getAdminToken();

        $response = $this->withToken($token)->postJson('/api/usuarios', [
            'nombre'   => 'Nuevo Colaborador',
            'email'    => 'colab_' . uniqid() . '@test.com',
            'password' => 'password123',
            'rol'      => 'colaborador',
            'estado'   => 'activo',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'id']);
    }

    public function test_crear_usuario_falla_sin_campos_requeridos(): void
    {
        $token = $this->getAdminToken();

        $response = $this->withToken($token)->postJson('/api/usuarios', [
            'nombre' => 'Solo nombre',
        ]);

        $response->assertStatus(400);
    }

    public function test_crear_usuario_falla_con_rol_invalido(): void
    {
        $token = $this->getAdminToken();

        $response = $this->withToken($token)->postJson('/api/usuarios', [
            'nombre'   => 'Test',
            'email'    => 'rol_' . uniqid() . '@test.com',
            'password' => 'password123',
            'rol'      => 'superheroe',   // rol inválido
            'estado'   => 'activo',
        ]);

        $response->assertStatus(400);
    }

    // PUT /api/usuarios/{id} 

    public function test_actualizar_usuario_exitoso(): void
    {
        $token = $this->getAdminToken();
        $id    = $this->crearUsuario();

        $response = $this->withToken($token)->putJson("/api/usuarios/{$id}", [
            'nombre'           => 'Nombre Actualizado',
            'email'            => 'upd_' . uniqid() . '@test.com',
            'rol'              => 'editor',
            'estado'           => 'inactivo',
            'check_verificado' => true,
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Usuario actualizado correctamente']);
    }

    public function test_actualizar_password_exitoso(): void
    {
        $token = $this->getAdminToken();
        $id    = $this->crearUsuario();

        $response = $this->withToken($token)->putJson("/api/usuarios/{$id}", [
            '_changePassword' => true,
            'password'        => 'nuevaPassword123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Contraseña actualizada correctamente']);
    }

    public function test_actualizar_usuario_sin_token(): void
    {
        $id = $this->crearUsuario();

        $response = $this->putJson("/api/usuarios/{$id}", [
            'nombre' => 'Hacker',
            'email'  => 'hack@test.com',
            'rol'    => 'colaborador',
            'estado' => 'activo',
        ]);

        $response->assertStatus(401);
    }

    // DELETE /api/usuarios/{id} 

    public function test_eliminar_usuario_exitoso(): void
    {
        $token = $this->getAdminToken();
        $id    = $this->crearUsuario();

        $response = $this->withToken($token)->deleteJson("/api/usuarios/{$id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Usuario eliminado correctamente']);
    }

    public function test_eliminar_usuario_sin_token(): void
    {
        $id = $this->crearUsuario();

        $response = $this->deleteJson("/api/usuarios/{$id}");

        $response->assertStatus(401);
    }
}
