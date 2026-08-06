document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const year = document.querySelector("[data-year]");
  const form = document.getElementById("contactForm");
  const status = document.querySelector("[data-form-status]");
  const emailCopy = document.querySelector("[data-email-copy]");
  const reveals = document.querySelectorAll("[data-reveal]");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const setHeaderState = () => {
    if (!header) return;
    const scrolled = window.scrollY > 24;
    const onHero = window.scrollY < window.innerHeight * 0.72;
    header.classList.toggle("is-scrolled", scrolled);
    header.classList.toggle("is-hero", onHero);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });
  window.addEventListener("resize", setHeaderState);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  reveals.forEach((el, i) => {
    el.style.setProperty("--reveal-i", String(i % 6));
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  document.querySelectorAll(".hero [data-reveal]").forEach((el) => {
    requestAnimationFrame(() => el.classList.add("is-in"));
  });

  if (emailCopy) {
    const label = emailCopy.textContent;
    emailCopy.addEventListener("click", async () => {
      const address = emailCopy.getAttribute("data-email") || label;
      try {
        await navigator.clipboard.writeText(address);
        emailCopy.textContent = "Kopyalandı";
        emailCopy.classList.add("is-copied");
        window.setTimeout(() => {
          emailCopy.textContent = label;
          emailCopy.classList.remove("is-copied");
        }, 1600);
      } catch {
        emailCopy.textContent = address;
      }
    });
  }

  if (form && status) {
    const CONTACT_EMAIL = "faruktazeoglu9@gmail.com";
    const FORMSUBMIT_ID = "7ed587bedf0bcc3b7c4d2cad17418e37";
    const isHosted =
      location.protocol === "http:" || location.protocol === "https:";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !message) {
        status.textContent = "Lütfen tüm alanları doldurun.";
        return;
      }

      const payload = {
        name,
        email,
        message,
        _subject: `Portföy iletişimi — ${name}`,
      };

      status.textContent = "Gönderiliyor…";

      if (isHosted) {
        try {
          const response = await fetch(
            `https://formsubmit.co/ajax/${FORMSUBMIT_ID}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) throw new Error("submit failed");

          status.textContent = "Mesajınız gönderildi. Teşekkürler.";
          form.reset();
          return;
        } catch {
          status.textContent =
            "Gönderim başarısız. Mail adresini kopyalayıp doğrudan yazabilirsiniz.";
          return;
        }
      }

      const draft = `Kime: ${CONTACT_EMAIL}\nAd: ${name}\nE-posta: ${email}\n\n${message}`;
      try {
        await navigator.clipboard.writeText(draft);
        status.textContent =
          "Lokal önizleme: mesaj panoya kopyalandı. Canlı sitede doğrudan mailinize gider.";
      } catch {
        status.textContent = `Lokal önizleme — şu adrese yazın: ${CONTACT_EMAIL}`;
      }
      form.reset();
    });
  }
});
