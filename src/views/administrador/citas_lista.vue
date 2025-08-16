<template>
		<!-- Filtros superiores en una sola fila, consultorio y médico como select list -->
		<div class="d-print-none card mb-3">
			<div class="card-body py-3 px-4">
				<div class="row align-items-center gx-2 gy-2">
					<div class="col-lg-2 col-md-3 col-6">
						<label class="form-label text-secondary text-sm f-w-600 mb-1">Consultorio</label>
						<select class="form-select">
							<option value="">Seleccionar consultorio</option>
							<option>Consultorio 1</option>
							<option>Consultorio 2</option>
							<option>Consultorio 3</option>
						</select>
					</div>
					<div class="col-lg-2 col-md-3 col-6">
						<label class="form-label text-secondary text-sm f-w-600 mb-1">Médico</label>
						<select class="form-select">
							<option value="">Seleccionar médico</option>
							<option>Dr. Ejemplo</option>
							<option>Dr. Pérez</option>
							<option>Dr. García</option>
						</select>
					</div>
					<div class="col-lg-2 col-md-2 col-4">
						<label class="form-label text-secondary text-sm f-w-600 mb-1">Año</label>
						<select class="form-select form-select-sm bg-light">
							<option value="">Año</option>
							<option>2025</option>
						</select>
					</div>
					<div class="col-lg-2 col-md-2 col-4">
						<label class="form-label text-secondary text-sm f-w-600 mb-1">Mes</label>
						<select class="form-select form-select-sm bg-light">
							<option value="">Mes</option>
							<option>Agosto</option>
						</select>
					</div>
					<div class="col-lg-2 col-md-2 col-4">
						<label class="form-label text-secondary text-sm f-w-600 mb-1">Día</label>
						<input type="text" class="form-control form-control-sm bg-light" placeholder="Día" />
					</div>
					<div class="col-lg-2 col-md-2 col-12 d-flex align-items-end">
						<button class="btn btn-primary w-100 me-2">
							<i class="ti ti-search"></i> Buscar
						</button>
						<button class="btn btn-secondary btn-sm w-100">
							<i class="fa fa-broom"></i>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Cards resumen de citas estilo moderno -->
		<div class="row g-3 mb-2">
			<div class="col-lg-3 col-md-6">
				<div class="card">
					<div class="card-body">
						<div class="d-flex align-items-center">
							<div class="flex-shrink-0">
								<div class="avtar bg-light-warning">
									<i class="fa fa-clock f-24 text-warning"></i>
								</div>
							</div>
							<div class="flex-grow-1 ms-3">
								<p class="mb-1">Pendientes</p>
								<div class="d-flex align-items-center justify-content-between">
									<h4 class="mb-0">32</h4>
									<span class="text-success fw-medium">+5%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-lg-3 col-md-6">
				<div class="card">
					<div class="card-body">
						<div class="d-flex align-items-center">
							<div class="flex-shrink-0">
								<div class="avtar bg-light-success">
									<i class="fa fa-check-circle f-24 text-success"></i>
								</div>
							</div>
							<div class="flex-grow-1 ms-3">
								<p class="mb-1">Atendidas</p>
								<div class="d-flex align-items-center justify-content-between">
									<h4 class="mb-0">18</h4>
									<span class="text-success fw-medium">+2%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-lg-3 col-md-6">
				<div class="card">
					<div class="card-body">
						<div class="d-flex align-items-center">
							<div class="flex-shrink-0">
								<div class="avtar bg-light-danger">
									<i class="fa fa-times-circle f-24 text-danger"></i>
								</div>
							</div>
							<div class="flex-grow-1 ms-3">
								<p class="mb-1">Canceladas</p>
								<div class="d-flex align-items-center justify-content-between">
									<h4 class="mb-0">5</h4>
									<span class="text-danger fw-medium">-1%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-lg-3 col-md-6">
				<div class="card">
					<div class="card-body">
						<div class="d-flex align-items-center">
							<div class="flex-shrink-0">
								<div class="avtar bg-light-secondary">
									<i class="fa fa-calendar-alt f-24 text-secondary"></i>
								</div>
							</div>
							<div class="flex-grow-1 ms-3">
								<p class="mb-1">Total citas</p>
								<div class="d-flex align-items-center justify-content-between">
									<h4 class="mb-0">55</h4>
									<span class="text-info fw-medium">+10%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	<!-- Tabla de citas usando DataTablePaginacion -->
	<div class="card">
		<div class="card-body mx-0 p-1">
			<DataTablePaginacion
				:headers="headers"
				:items="listaCitas"
				:currentPage="1"
				:perPage="10"
				:clasehead="'bg-info-200'"
			>
				<template #default="{ item, index, globalIndex }">
					<tr>
						<td class="mx-0 text-center f-12 px-1">{{ globalIndex }}</td>
						<td class="text-wrap f-12 f-w-500">{{ item.consultorio }}</td>
						<td class="text-wrap f-12 f-w-500">{{ item.medico }}</td>
						<td class="text-wrap f-12 f-w-500">{{ item.paciente }}</td>
						<td class="text-wrap f-12">{{ item.hora_inicio }}</td>
						<td class="text-wrap f-12">{{ item.hora_fin }}</td>
						<td><span :class="item.estado === 'Activo' ? 'badge bg-success' : 'badge bg-danger'">{{ item.estado }}</span></td>
						<td class="text-wrap d-flex">
							<button class="btn btn-light-warning btn-sm me-1"><i class="ti ti-edit"></i></button>
							<button class="btn btn-light-danger btn-sm"><i class="ti ti-trash"></i></button>
						</td>
					</tr>
				</template>
			</DataTablePaginacion>
		</div>
	</div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import DataTablePaginacion from '../../components/table/DataTablePaginacion.vue';

export default defineComponent({
	components: {
		DataTablePaginacion
	},
	setup() {
		// Headers para la tabla de citas
		const headers = ref([
			{ text: '#', width: '3%', key: 'index', type: 'string' as const, sortable: false },
			{ text: 'CONSULTORIO', width: '12%', key: 'consultorio', type: 'string' as const, sortable: true },
			{ text: 'MÉDICO', width: '12%', key: 'medico', type: 'string' as const, sortable: true },
			{ text: 'PACIENTE', width: '15%', key: 'paciente', type: 'string' as const, sortable: true },
			{ text: 'HORA INICIO', width: '10%', key: 'hora_inicio', type: 'string' as const, sortable: true },
			{ text: 'HORA FIN', width: '10%', key: 'hora_fin', type: 'string' as const, sortable: true },
			{ text: 'ESTADO', width: '8%', key: 'estado', type: 'string' as const, sortable: true },
			{ text: 'ACCIONES', width: '10%', key: 'acciones', type: 'string' as const, sortable: false },
		]);

		// Ejemplo de datos para la tabla
		const listaCitas = ref([
			{
				consultorio: 'Consultorio 1',
				medico: 'Dr. Ejemplo',
				paciente: 'Paciente Ejemplo',
				hora_inicio: '09:00',
				hora_fin: '09:30',
				estado: 'Activo'
			}
		]);

		return {
			headers,
			listaCitas
		};
	}
});
</script>