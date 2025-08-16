<template>
	<!-- Filtros superiores -->
	<div class="d-print-none card mb-3">
		<div class="card-body p-3">
			<div class="row">
				<div class="col-6 d-flex align-items-center">
					<label class="form-label px-2 text-secondary text-sm f-w-600 align-content-center text-nowrap">Consultorio</label>
					<input class="form-control f-6 mx-2" style="min-width: 250px;" placeholder="Seleccionar consultorio" />
				</div>
				<div class="col-4 d-flex align-items-center">
					<label class="form-label px-2 text-secondary text-sm f-w-600 text-nowrap">Médico</label>
					<input class="form-control f-6 mx-2" style="min-width: 220px;" placeholder="Seleccionar médico" />
				</div>
			</div>
			<div class="d-flex pt-1">
				<div class="d-flex">
					<label class="form-label px-2 text-secondary text-sm f-w-600 align-content-center">Año</label>
					<select class="form-select form-select-sm bg-light ">
						<option value="">Año</option>
						<option>2025</option>
					</select>
				</div>
				<div class="d-flex">
					<label class="form-label px-2 text-secondary text-sm f-w-600 align-content-center">Mes</label>
					<select class="form-select form-select-sm bg-light mx-2">
						<option value="">Mes</option>
						<option>Agosto</option>
					</select>
				</div>
				<div class="d-flex">
					<label class="form-label px-2 text-secondary text-sm f-w-600 align-content-center">Día</label>
					<input type="text" class="form-control form-control-sm bg-light wid-150 mx-2" placeholder="Día" />
				</div>
				<button class="btn btn-primary mx-1">
					<i class="ti ti-search"></i> Buscar
				</button>
				<button class="btn btn-secondary btn-sm mx-1">
					<i class="fa fa-broom"></i>
				</button>
			</div>
		</div>
	</div>

	<!-- Cards resumen de citas -->
	<div class="row g-3 mb-2">
		<div class="col-md-3">
			<div class="card shadow-sm border-0 bg-info text-white">
				<div class="card-body d-flex align-items-center">
					<div>
						<div class="fs-3 fw-bold">32</div>
						<div class="fw-semibold">Pendientes</div>
					</div>
					<div class="ms-auto fs-2"><i class="fa fa-clock"></i></div>
				</div>
			</div>
		</div>
		<div class="col-md-3">
			<div class="card shadow-sm border-0 bg-success text-white">
				<div class="card-body d-flex align-items-center">
					<div>
						<div class="fs-3 fw-bold">18</div>
						<div class="fw-semibold">Atendidas</div>
					</div>
					<div class="ms-auto fs-2"><i class="fa fa-check-circle"></i></div>
				</div>
			</div>
		</div>
		<div class="col-md-3">
			<div class="card shadow-sm border-0 bg-danger text-white">
				<div class="card-body d-flex align-items-center">
					<div>
						<div class="fs-3 fw-bold">5</div>
						<div class="fw-semibold">Canceladas</div>
					</div>
					<div class="ms-auto fs-2"><i class="fa fa-times-circle"></i></div>
				</div>
			</div>
		</div>
		<div class="col-md-3">
			<div class="card shadow-sm border-0 bg-secondary text-white">
				<div class="card-body d-flex align-items-center">
					<div>
						<div class="fs-3 fw-bold">55</div>
						<div class="fw-semibold">Total citas</div>
					</div>
					<div class="ms-auto fs-2"><i class="fa fa-calendar-alt"></i></div>
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