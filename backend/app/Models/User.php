<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     * Las columnas exactas de tu base de datos permitidas para modificación masiva
     */
    protected $fillable = [
        'nombre',
        'email',
        'password',
        'imagen',
        'rol',
        'estado',
        'check_verificado',
        'telefono',
        'direccion',
        'google_id',
        'reset_token',
        'reset_token_expires',
        'email_verified_at',
    ];

    /**
     * Los atributos ocultos cuando devuelves la data del usuario (por seguridad)
     */
    protected $hidden = [
        'password',
        'remember_token',
        'reset_token',
    ];

    /**
     * Conversión nativa de cómo deben ser tratados los datos de la base de datos
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'reset_token_expires' => 'datetime',
            'password' => 'hashed',            // Laravel se encargará de hashearlo internamente
            'check_verificado' => 'boolean',
        ];
    }
    
    /**
     * Obtener el identificador que irá en el Token firmado (por defecto será el 'id')
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Payload: Información extra tuya agregada como "carga útil" dentro del web token decodificado
     */
    public function getJWTCustomClaims()
    {
        // Al enviar el token al react frontend con Shadcn, también mandaremos su rol para fácil lectura
        return [
            'nombre' => $this->nombre,
            'email' => $this->email,
            'rol' => $this->rol,
            'estado' => $this->estado
        ];
    }
}
