<template>
  <!-- <div class="pc-container"> -->
    <div class="pc-content">
  
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body position-relative">
              <div id="calendar" class="calendar"></div>
            </div>
          </div>
        </div>
      </div>
    <!-- </div> -->
    <!-- Modal para ver evento -->
    <div class="modal fade" id="calendar-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="calendar-modal-title f-w-600 text-truncate">{{ selectedEvent?.title || 'Modal title' }}</h3>
            <button type="button" class="btn btn-link-danger btn-pc-default" data-bs-dismiss="modal">
              <i class="ti ti-x f-20"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="d-flex mb-2">
              <div class="avtar avtar-xs bg-light-secondary"><i class="ti ti-heading f-20"></i></div>
              <div class="ms-3"><h5 class="mb-1"><b>Title</b></h5><p class="pc-event-title text-muted">{{ selectedEvent?.title }}</p></div>
            </div>
            <div class="d-flex mb-2">
              <div class="avtar avtar-xs bg-light-warning"><i class="ti ti-map-pin f-20"></i></div>
              <div class="ms-3"><h5 class="mb-1"><b>Venue</b></h5><p class="pc-event-venue text-muted">{{ selectedEvent?.venue || '-' }}</p></div>
            </div>
            <div class="d-flex mb-2">
              <div class="avtar avtar-xs bg-light-danger"><i class="ti ti-calendar-event f-20"></i></div>
              <div class="ms-3"><h5 class="mb-1"><b>Date</b></h5><p class="pc-event-date text-muted">{{ selectedEvent?.date || '-' }}</p></div>
            </div>
            <div class="d-flex mb-2">
              <div class="avtar avtar-xs bg-light-primary"><i class="ti ti-file-text f-20"></i></div>
              <div class="ms-3"><h5 class="mb-1"><b>Description</b></h5><p class="pc-event-description text-muted">{{ selectedEvent?.description || '-' }}</p></div>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <ul class="list-inline me-auto mb-0">
              <li class="list-inline-item align-bottom">
                <button class="btn btn-link-danger btn-pc-default" title="Delete"><i class="ti ti-trash f-18"></i></button>
              </li>
              <li class="list-inline-item align-bottom">
                <button class="btn btn-link-success btn-pc-default" title="Edit" @click="openEditEventOffcanvas"><i class="ti ti-edit-circle f-18"></i></button>
              </li>
            </ul>
            <div class="flex-grow-1 text-end">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Offcanvas para agregar/editar evento -->
    <div class="offcanvas offcanvas-end cal-event-offcanvas" tabindex="-1" id="calendar-add_edit_event">
      <div class="offcanvas-header">
        <h3 class="f-w-600 text-truncate">Add Events</h3>
        <button type="button" class="btn btn-link-danger btn-pc-default" data-bs-dismiss="offcanvas">
          <i class="ti ti-x f-20"></i>
        </button>
      </div>
      <div class="offcanvas-body">
        <form id="pc-form-event" novalidate>
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" class="form-control" id="pc-e-title" placeholder="Enter event title" autofocus>
          </div>
          <div class="mb-3">
            <label class="form-label">Venue</label>
            <input type="text" class="form-control" id="pc-e-venue" placeholder="Enter event venue">
          </div>
          <input type="hidden" class="form-control" id="pc-e-sdate">
          <input type="hidden" class="form-control" id="pc-e-edate">
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" placeholder="Enter event description" rows="3" id="pc-e-description"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Type</label>
            <select class="form-select" id="pc-e-type">
              <option value="empty" selected>Type</option>
              <option value="event-primary">Primary</option>
              <option value="event-secondary">Secondary</option>
              <option value="event-success">Success</option>
              <option value="event-danger">Danger</option>
              <option value="event-warning">Warning</option>
              <option value="event-info">Info</option>
            </select>
          </div>
          <div class="row justify-content-between">
            <div class="col-auto">
              <button type="button" class="btn btn-link-danger btn-pc-default" data-bs-dismiss="offcanvas">
                <i class="align-text-bottom me-1 ti ti-circle-x"></i> Close
              </button>
            </div>
            <div class="col-auto">
              <button id="pc_event_add" type="button" class="btn btn-secondary" @click="openAddEventOffcanvas">
                <span id="pc-e-btn-text"><i class="align-text-bottom me-1 ti ti-calendar-plus"></i> Add</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { Modal, Offcanvas } from 'bootstrap'
import esLocale from '@fullcalendar/core/locales/es'

const selectedEvent = ref<any | null>(null)

function formatDateRange(start: string, end?: string) {
  if (!end) return start
  return `${start} a ${end}`
}


function openAddEventOffcanvas() {
  const offcanvas = document.getElementById('calendar-add_edit_event')
  if (!offcanvas) return
  const bsOffcanvas = Offcanvas.getOrCreateInstance(offcanvas)
  if (!bsOffcanvas) return
  bsOffcanvas.show()
}

function openEditEventOffcanvas() {
  const offcanvas = document.getElementById('calendar-add_edit_event')
  if (!offcanvas) return
  const bsOffcanvas = Offcanvas.getOrCreateInstance(offcanvas)
  if (!bsOffcanvas) return
  bsOffcanvas.show()
  // Opcional: cerrar el modal
  const modal = document.getElementById('calendar-modal')
  if (!modal) return
  const bsModal = Modal.getOrCreateInstance(modal)
  if (!bsModal) return
  bsModal.hide()
}

onMounted(() => {
  const calendarEl = document.getElementById('calendar')
  if (calendarEl) {
    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      locales: [esLocale],
      locale: 'es',
      events: [
        {
          title: 'All Day Event',
          start: '2025-08-01',
          color: '#ffeeba',
          venue: 'Main Hall',
          description: 'Evento de todo el día',
        },
        {
          title: 'Long Event',
          start: '2025-08-06',
          end: '2025-08-10',
          color: '#b3e5fc',
          venue: 'City Town',
          description: 'Evento largo de varios días',
        },
        {
          title: 'Repeating Event',
          start: '2025-08-09T16:00:00',
          color: '#ffcdd2',
          venue: 'Conference Room',
          description: 'Evento repetitivo',
        }
      ],
      eventClick: function(info) {
        selectedEvent.value = {
          title: info.event.title,
          venue: info.event.extendedProps.venue,
          description: info.event.extendedProps.description,
          date: formatDateRange(
            info.event.startStr,
            info.event.endStr
          )
        }
        const modal = document.getElementById('calendar-modal')
        if (!modal) return
        const bsModal = Modal.getOrCreateInstance(modal)
        if (!bsModal) return
        bsModal.show()
      }
    })
    calendar.render()
  }
})
</script>

<style scoped>
/* @import '../../assets/css/style.css';
@import '../../assets/css/style-preset.css'; */
/* .calendar {
  min-height: 500px;
} */
</style>