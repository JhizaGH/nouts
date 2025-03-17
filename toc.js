// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="bienvenido.html">Bienvenido</a></li><li class="chapter-item expanded affix "><li class="part-title">Notas de japonés</li><li class="chapter-item expanded "><a href="antes_de_leer.html"><strong aria-hidden="true">1.</strong> Antes de leer</a></li><li class="chapter-item expanded "><a href="japo/introduccion.html"><strong aria-hidden="true">2.</strong> Introducción</a></li><li class="chapter-item expanded "><a href="japo/verbo_ser.html"><strong aria-hidden="true">3.</strong> El verbo ser</a></li><li class="chapter-item expanded "><a href="japo/particulas.html"><strong aria-hidden="true">4.</strong> Partículas</a></li><li class="chapter-item expanded "><a href="japo/adjetivos.html"><strong aria-hidden="true">5.</strong> Adjetivos</a></li><li class="chapter-item expanded "><a href="japo/verbos.html"><strong aria-hidden="true">6.</strong> Verbos</a></li><li class="chapter-item expanded "><a href="japo/verbos_negativos.html"><strong aria-hidden="true">7.</strong> Verbos negativos</a></li><li class="chapter-item expanded "><a href="japo/particulas_wo_ni_de.html"><strong aria-hidden="true">8.</strong> Partículas を, に y で</a></li><li class="chapter-item expanded "><a href="japo/adjetivos_i_irregulares.html"><strong aria-hidden="true">9.</strong> Adjetivos -i irregulares</a></li><li class="chapter-item expanded "><a href="japo/verbos_pasados.html"><strong aria-hidden="true">10.</strong> Verbos en forma pasada</a></li><li class="chapter-item expanded "><a href="japo/verbos_in_transitivos.html"><strong aria-hidden="true">11.</strong> Verbos (intransitivos)</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">12.</strong> Más contenido próximamente</div></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Reflexiones: Ninshiki Shinakute Mo</li><li class="chapter-item expanded "><a href="reflexiones/maldita_productividad.html"><strong aria-hidden="true">13.</strong> Maldita productividad</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">14.</strong> ¡Qué el idioma no te torture!</div></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
