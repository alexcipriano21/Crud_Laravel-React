<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        $stats = DB::select('CALL sp_dashboardStats()');
        
        if (count($stats) === 0) {
            return response()->json([
                'total_usuarios' => 0,
                'total_activos' => 0,
                'total_inactivos' => 0,
                'total_pendientes' => 0
            ]);
        }
        
        return response()->json($stats[0]);
    }

    public function getCharts()
    {
        $pdo = DB::connection()->getPdo();
        $stmt = $pdo->prepare('CALL sp_dashboardGraficos()');
        $stmt->execute();
        $graficoMeses = $stmt->fetchAll(\PDO::FETCH_OBJ);
        
        $stmt->nextRowset();
        $graficoRoles = $stmt->fetchAll(\PDO::FETCH_OBJ);
        return response()->json([
            'por_mes' => $graficoMeses,
            'por_rol' => $graficoRoles
        ]);
    }
}
