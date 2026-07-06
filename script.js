/* ============================================================
   Nath Homeopathy — shared site behaviour
   Clinic WhatsApp number is centralised here so it only needs
   updating in one place if it ever changes.
   ============================================================ */
const CLINIC = {
  phone: "919799933503",          // international format for wa.me links
  phoneDisplay: "+91 97999 33503",
  tel: "tel:+919799933503",
  email: "info@nathhomeopathy.in", // placeholder — update if a real inbox exists
  mapLink: "https://maps.app.goo.gl/LCDe3njFEArwp9gP8",
  address: "Laxmi Market, Near Arabiyon Ki Masjid, Near Archana Colour Lab, Kuchilpura, Bikaner - 334001, Rajasthan"
};

function waLink(message) {
  return `https://wa.me/${CLINIC.phone}?text=${encodeURIComponent(message)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* ---------- Wire up any [data-wa-link] elements ---------- */
  document.querySelectorAll("[data-wa-message]").forEach((el) => {
    el.setAttribute("href", waLink(el.getAttribute("data-wa-message")));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* ---------- Slot selection (booking page) ---------- */
  const slotInputs = document.querySelectorAll(".slot input[type='radio']");
  slotInputs.forEach((input) => {
    input.addEventListener("change", () => {
      document.querySelectorAll(".slot").forEach((s) => s.classList.remove("selected"));
      input.closest(".slot").classList.add("selected");
    });
  });

  /* ---------- Booking form -> WhatsApp handoff ---------- */
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = bookingForm.querySelector("#bName").value.trim();
      const phone = bookingForm.querySelector("#bPhone").value.trim();
      const type = bookingForm.querySelector("input[name='bookingType']:checked");
      const slot = bookingForm.querySelector("input[name='slot']:checked");
      const notes = bookingForm.querySelector("#bNotes").value.trim();

      if (!name || !phone || !slot) {
        showFormError(bookingForm, "Please fill your name, phone number, and pick a slot before continuing.");
        return;
      }

      const typeLabel = type ? type.value : "Appointment";
      const slotLabel = slot.closest(".slot").querySelector("strong").textContent + " — " + slot.closest(".slot").querySelector("span").textContent;

      const message =
        `Hello Nath Homeopathy, I'd like to book a ${typeLabel}.\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Preferred slot: ${slotLabel}` +
        (notes ? `\nNotes: ${notes}` : "");

      const confirmBox = document.getElementById("bookingConfirm");
      if (confirmBox) {
        confirmBox.classList.add("show");
        confirmBox.querySelector(".confirm-summary").textContent =
          `${typeLabel} request for ${slotLabel} — tap below to send it to the clinic on WhatsApp.`;
        confirmBox.querySelector("a.btn-whatsapp").setAttribute("href", waLink(message));
        confirmBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  /* ---------- Contact form -> WhatsApp handoff ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector("#cName").value.trim();
      const phone = contactForm.querySelector("#cPhone").value.trim();
      const msg = contactForm.querySelector("#cMessage").value.trim();

      if (!name || !phone || !msg) {
        showFormError(contactForm, "Please fill in your name, phone number, and message.");
        return;
      }

      const message = `Hello Nath Homeopathy,\nName: ${name}\nPhone: ${phone}\nMessage: ${msg}`;
      window.open(waLink(message), "_blank", "noopener");
    });
  }

  function showFormError(form, text) {
    let err = form.querySelector(".form-error");
    if (!err) {
      err = document.createElement("p");
      err.className = "form-error";
      err.style.color = "#a12626";
      err.style.fontWeight = "600";
      err.style.fontSize = "0.88rem";
      err.setAttribute("role", "alert");
      form.prepend(err);
    }
    err.textContent = text;
  }
});


/* Pause other videos when one starts playing */
document.addEventListener("DOMContentLoaded", () => {
  const vids = document.querySelectorAll(".video-card video");
  vids.forEach((v) => {
    v.addEventListener("play", () => {
      vids.forEach((o) => { if (o !== v) o.pause(); });
    });
  });
});
