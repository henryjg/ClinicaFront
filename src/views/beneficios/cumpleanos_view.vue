<template>
    <div class="container py-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="btn btn-link-info f-14" @click="mesAnterior">&lt; Mes anterior</div>
            <h1 class="fw-bold mb-0">{{ nombreMesActual }}</h1>
            <div class="btn btn-link-info" @click="mesSiguiente">Mes siguiente &gt;</div>
        </div>

        <div class="row justify-content-center">
            <div class="col-12 col-md-10 col-lg-8">
                <!-- Si es el mes actual, muestra los 3 cards -->
                <template v-if="mesActual === new Date().getMonth()">
                    <!-- Card Cumplen hoy -->
                    <div class="card shadow-sm mb-4">
                        <div class="card-header d-flex justify-content-between align-items-center bg-white border-0">
                            <h4 class="mb-0">Cumplen hoy</h4>
                            <button class="btn btn-link p-0 text-dark fs-4" @click="showHoy = !showHoy">
                                <span v-if="showHoy">&minus;</span>
                                <span v-else>&#43;</span>
                            </button>
                        </div>
                        <div v-show="showHoy" class="card-body">
                            <div class="row align-items-center">
                                <div class="col-12 col-md-7">
                                    <div class="text-uppercase text-muted small mb-2">{{ diaSemana }} {{ diaMes }}</div>
                                    <div v-if="cumpleanerosHoy.length > 0">
                                        <div v-for="trabajador in cumpleanerosHoy" :key="trabajador.id" class="d-flex align-items-center mb-3">
                                            <div class="rounded-circle d-flex align-items-center justify-content-center me-3 bg-primary text-white fw-bold" style="width:44px;height:44px;">
                                                {{ iniciales(trabajador.nombre, trabajador.apePaterno) }}
                                            </div>
                                            <span class="fw-semibold">{{ trabajador.nombre }} {{ trabajador.apePaterno }}</span>
                                        </div>
                                    </div>
                                    <div v-else class="text-secondary">Nadie cumple hoy</div>
                                </div>
                                <div class="col-12 col-md-5 text-center">
                                    <img src="../../assets//images/pastel.png" alt="cumpleaños" class="img-fluid" style="max-height:160px;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Card Próximos del mes -->
                    <div class="card shadow-sm mb-4">
                        <div class="card-header d-flex justify-content-between align-items-center bg-white border-0">
                            <h4 class="mb-0">Próximos del mes</h4>
                            <button class="btn btn-link p-0 text-dark fs-4" @click="showProximos = !showProximos">
                                <span v-if="showProximos">&minus;</span>
                                <span v-else>&#43;</span>
                            </button>
                        </div>
                        <div v-show="showProximos" class="card-body">
                            <div v-if="proximosDelMes.length > 0">
                                <template v-for="(grupo, fecha) in proximosDelMesAgrupados">
                                    <div class="text-uppercase text-muted small mb-2">{{ grupo.diaSemana }} {{ grupo.diaMes }}</div>
                                    <div class="row mb-3">
                                        <div v-for="trabajador in grupo.trabajadores" :key="trabajador.id" class="col-12 col-md-6 d-flex align-items-center mb-2">
                                            <div class="rounded-circle d-flex align-items-center justify-content-center me-3 bg-info text-white fw-bold" style="width:44px;height:44px;">
                                                {{ iniciales(trabajador.nombre, trabajador.apePaterno) }}
                                            </div>
                                            <span class="fw-semibold">{{ trabajador.nombre }} {{ trabajador.apePaterno }}</span>
                                        </div>
                                    </div>
                                    <hr class="my-2" />
                                </template>
                            </div>
                            <div v-else class="text-secondary">No hay próximos cumpleaños este mes.</div>
                        </div>
                    </div>
                    <!-- Card Han cumplido este mes -->
                    <div class="card shadow-sm mb-4">
                        <div class="card-header d-flex justify-content-between align-items-center bg-white border-0">
                            <h4 class="mb-0">Han cumplido este mes</h4>
                            <button class="btn btn-link p-0 text-dark fs-4" @click="showCumplieron = !showCumplieron">
                                <span v-if="showCumplieron">&minus;</span>
                                <span v-else>&#43;</span>
                            </button>
                        </div>
                        <div v-show="showCumplieron" class="card-body">
                            <div v-if="cumplieronEsteMes.length > 0">
                                <template v-for="(grupo, fecha) in cumplieronEsteMesAgrupados">
                                    <div class="text-uppercase text-muted small mb-2">{{ grupo.diaSemana }} {{ grupo.diaMes }}</div>
                                    <div class="row mb-3">
                                        <div v-for="trabajador in grupo.trabajadores" :key="trabajador.id" class="col-12 col-md-6 d-flex align-items-center mb-2">
                                            <div class="rounded-circle d-flex align-items-center justify-content-center me-3 bg-info text-white fw-bold" style="width:44px;height:44px;">
                                                {{ iniciales(trabajador.nombre, trabajador.apePaterno) }}
                                            </div>
                                            <span class="fw-semibold">{{ trabajador.nombre }} {{ trabajador.apePaterno }}</span>
                                        </div>
                                    </div>
                                    <hr class="my-2" />
                                </template>
                            </div>
                            <div v-else class="text-secondary">Nadie ha cumplido este mes.</div>
                        </div>
                    </div>
                </template>
                <!-- Si es otro mes, solo muestra la lista de cumpleaños de ese mes -->
                <template v-else>
                    <div class="card shadow-sm mb-4">
                        <div class="card-header bg-white border-0">
                            <h4 class="mb-0">Cumpleaños de {{ nombreMesActual }}</h4>
                        </div>
                        <div class="card-body">
                            <div v-if="cumpleanerosDelMes.length > 0">
                                <template v-for="(grupo, fecha) in cumpleanerosDelMesAgrupados">
                                    <div class="text-uppercase text-muted small mb-2">{{ grupo.diaSemana }} {{ grupo.diaMes }}</div>
                                    <div class="row mb-3">
                                        <div v-for="trabajador in grupo.trabajadores" :key="trabajador.id" class="col-12 col-md-6 d-flex align-items-center mb-2">
                                            <div class="rounded-circle d-flex align-items-center justify-content-center me-3 bg-info text-white fw-bold" style="width:44px;height:44px;">
                                                {{ iniciales(trabajador.nombre, trabajador.apePaterno) }}
                                            </div>
                                            <span class="fw-semibold">{{ trabajador.nombre }} {{ trabajador.apePaterno }}</span>
                                        </div>
                                    </div>
                                    <hr class="my-2" />
                                </template>
                            </div>
                            <div v-else class="text-secondary">No hay cumpleaños para este mes.</div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTrabajador } from '../../composables/useTrabajador';

export default {
    setup() {
        const { ListaTrabajadores, Listar_Trabajadores } = useTrabajador();
        const mesActual = ref(new Date().getMonth());
        const hoy = ref(new Date());

        const showHoy = ref(true);
        const showProximos = ref(false);
        const showCumplieron = ref(false);

        const nombreMeses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const nombreDias = [
            'DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'
        ];

        const nombreMesActual = computed(() => nombreMeses[mesActual.value]);

        // Día y fecha para la cabecera de "Cumplen hoy"
        const diaSemana = computed(() => nombreDias[hoy.value.getDay()]);
        const diaMes = computed(() => `${hoy.value.getDate()}/${hoy.value.getMonth() + 1}`);

        // Cumplen hoy (solo para el mes actual)
        const cumpleanerosHoy = computed(() => {
            if (mesActual.value !== new Date().getMonth()) return [];
            return ListaTrabajadores.value.filter(trabajador => {
                if (!trabajador.fechaNacimiento) return false;
                const fechaNacimiento = new Date(trabajador.fechaNacimiento);
                return fechaNacimiento.getDate() === hoy.value.getDate() && fechaNacimiento.getMonth() === hoy.value.getMonth();
            });
        });

        // Próximos del mes (solo para el mes actual, después de hoy)
        const proximosDelMes = computed(() => {
            if (mesActual.value !== new Date().getMonth()) return [];
            return ListaTrabajadores.value.filter(trabajador => {
                if (!trabajador.fechaNacimiento) return false;
                const fechaNacimiento = new Date(trabajador.fechaNacimiento);
                return fechaNacimiento.getMonth() === mesActual.value && fechaNacimiento.getDate() > hoy.value.getDate();
            });
        });

        // Han cumplido este mes (solo para el mes actual, antes de hoy)
        const cumplieronEsteMes = computed(() => {
            if (mesActual.value !== new Date().getMonth()) return [];
            return ListaTrabajadores.value.filter(trabajador => {
                if (!trabajador.fechaNacimiento) return false;
                const fechaNacimiento = new Date(trabajador.fechaNacimiento);
                return fechaNacimiento.getMonth() === mesActual.value && fechaNacimiento.getDate() < hoy.value.getDate();
            });
        });

        // Para otros meses, mostrar solo la lista de cumpleaños de ese mes
        const cumpleanerosDelMes = computed(() => {
            if (mesActual.value === new Date().getMonth()) return [];
            return ListaTrabajadores.value.filter(trabajador => {
                if (!trabajador.fechaNacimiento) return false;
                const fechaNacimiento = new Date(trabajador.fechaNacimiento);
                return fechaNacimiento.getMonth() === mesActual.value;
            });
        });

        // Agrupar por día para próximos y cumplidos
        function agruparPorDia(trabajadores: any[]) {
            const grupos: Record<string, any> = {};
            trabajadores.forEach(trabajador => {
                const fechaNacimiento = new Date(trabajador.fechaNacimiento);
                const diaSemana = nombreDias[fechaNacimiento.getDay()];
                const diaMes = `${fechaNacimiento.getDate()}/${fechaNacimiento.getMonth() + 1}`;
                const key = `${diaSemana} ${diaMes}`;
                if (!grupos[key]) {
                    grupos[key] = { diaSemana, diaMes, trabajadores: [] };
                }
                grupos[key].trabajadores.push(trabajador);
            });
            return grupos;
        }

        const proximosDelMesAgrupados = computed(() => agruparPorDia(proximosDelMes.value));
        const cumplieronEsteMesAgrupados = computed(() => agruparPorDia(cumplieronEsteMes.value));
        const cumpleanerosDelMesAgrupados = computed(() => agruparPorDia(cumpleanerosDelMes.value));

        const iniciales = (nombre: string, apellido: string) => {
            return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
        };

        const mesAnterior = () => {
            mesActual.value = (mesActual.value - 1 + 12) % 12;
        };

        const mesSiguiente = () => {
            mesActual.value = (mesActual.value + 1) % 12;
        };

        onMounted(() => {
            Listar_Trabajadores();
        });

        return {
            cumpleanerosHoy,
            proximosDelMes,
            cumplieronEsteMes,
            proximosDelMesAgrupados,
            cumplieronEsteMesAgrupados,
            cumpleanerosDelMes,
            cumpleanerosDelMesAgrupados,
            nombreMesActual,
            iniciales,
            mesAnterior,
            mesSiguiente,
            showHoy,
            showProximos,
            showCumplieron,
            diaSemana,
            diaMes,
            mesActual // <-- exporta mesActual para el template
        };
    },
};
</script>