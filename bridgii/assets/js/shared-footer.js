(function () {
  const footer = document.getElementById('siteFooter');
  if (!footer) return;

  footer.className = 'border-t border-[#e7c9d4]/80 bg-[#f8eef2]/70 py-10 text-slate-700';
  footer.innerHTML = `
    <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
      <div>
        <h3 class="text-base font-extrabold text-brandDeep">BRIDGII</h3>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">Visual-first learning through 3D models, simulations, virtual labs and AI-powered educational content.</p>
      </div>

      <div>
        <h4 class="text-sm font-extrabold text-brandDeep">Platform</h4>
        <ul class="mt-3 space-y-2 text-sm">
          <li><a href="videos.html" class="hover:text-[#8A1538]">Learning Videos</a></li>
          <li><a href="models.html" class="hover:text-[#8A1538]">3D Models & Simulations</a></li>
          <li><a href="labs.html" class="hover:text-[#8A1538]">Virtual Labs</a></li>
          <li><a href="books.html" class="hover:text-[#8A1538]">Books</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-extrabold text-brandDeep">Company</h4>
        <ul class="mt-3 space-y-2 text-sm">
          <li><a href="about.html" class="hover:text-[#8A1538]">About Us</a></li>
          <li><a href="team.html" class="hover:text-[#8A1538]">Team</a></li>
          <li><a href="contact.html" class="hover:text-[#8A1538]">Contact</a></li>
          <li><a href="activity.html" class="hover:text-[#8A1538]">Activity</a></li>
          <li><a href="services.html" class="hover:text-[#8A1538]">Services</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-extrabold text-brandDeep">Contact</h4>
        <ul class="mt-3 space-y-2 text-sm text-slate-600">
          <li><a href="mailto:kamanzifrank2020@gmail.com" class="hover:text-[#8A1538]">kamanzifrank2020@gmail.com</a></li>
          <li><a href="tel:+250798434591" class="hover:text-[#8A1538]">+250798434591</a></li>
          <li>Kigali, Rwanda</li>
        </ul>
      </div>
    </div>

    <div class="mx-auto mt-8 max-w-7xl border-t border-[#e7c9d4]/90 px-4 pt-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
      <p>&copy; <span id="year"></span> BRIDGII. All rights reserved.</p>
    </div>
  `;

  const yearNode = footer.querySelector('#year');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
})();

