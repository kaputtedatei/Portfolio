const timeline = document.getElementById('timeline');
    const detail = document.getElementById('detail');
    const detailTitle = document.getElementById('detail-title');
    const detailContent = document.getElementById('detail-content');
    const detailClose = document.getElementById('detail-close');
    const col2 = document.getElementById('col2');
    const col3 = document.getElementById('col3');
    const dynamicImage = document.getElementById('dynamicImage');




// --- Sortierlogik Index-Items ---
const sortButtons = document.querySelectorAll('.sort-btn');
let activeCategoryFilter = null;

// Ursprüngliche Ordnung der Grid Items
sortButtons.forEach(button => {
  button.addEventListener('click', () => {
    const sortBy = button.getAttribute('data-sort');
    
    // Toggle: Wenn derselbe Button erneut geklickt wird, Filter zurücksetzen
    if (activeCategoryFilter === sortBy) {
      activeCategoryFilter = null;
      sortButtons.forEach(btn => btn.classList.remove('active'));
      showAllTimelineItems();
      resetGridItemsOpacity();
    } else {
      activeCategoryFilter = sortBy;
      sortButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filterTimelineByCategory(sortBy);
      filterGridItemsByCategory(sortBy);
    }
  });
});

function filterTimelineByCategory(category) {
  const timelineList = document.getElementById('timeline');
  const items = timelineList.querySelectorAll('li');

  items.forEach(li => {
    const id = li.querySelector('.timeline-item').getAttribute('data-id');
    const data = timelineData.find(d => d.id === id);
    
    if (data && data.categories.includes(category)) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  });
}

function filterGridItemsByCategory(category) {
  const col2Content = document.querySelector('#col2 .column-content');
  const gridItems = Array.from(document.querySelectorAll('#col2 .grid-item'));
  
  // Sortiere Items: passende zuerst, dann transparente
  gridItems.sort((a, b) => {
    const idA = a.getAttribute('data-id');
    const idB = b.getAttribute('data-id');
    const dataA = timelineData.find(d => d.id === idA);
    const dataB = timelineData.find(d => d.id === idB);
    
    const matchesA = dataA && dataA.categories.includes(category) ? 0 : 1;
    const matchesB = dataB && dataB.categories.includes(category) ? 0 : 1;
    
    return matchesA - matchesB;
  });
  
  // Wende Sortierung an und setze Opacities
  gridItems.forEach(item => {
    const id = item.getAttribute('data-id');
    const data = timelineData.find(d => d.id === id);
    
    if (data && data.categories.includes(category)) {
      item.style.opacity = '1';
    } else {
      item.style.opacity = '0.05';
    }
    
    col2Content.appendChild(item);
  });
}

function showAllTimelineItems() {
  const timelineList = document.getElementById('timeline');
  const items = timelineList.querySelectorAll('li');
  items.forEach(li => li.style.display = '');
}

function resetGridItemsOpacity() {
  const col2Content = document.querySelector('#col2 .column-content');
  const gridItems = Array.from(document.querySelectorAll('#col2 .grid-item'));
  
  // Sortiere nach ursprünglicher Ordnung
  gridItems.sort((a, b) => {
    const idA = a.getAttribute('data-id');
    const idB = b.getAttribute('data-id');
    return originalGridOrder.indexOf(idA) - originalGridOrder.indexOf(idB);
  });
  
  // Wende ursprüngliche Ordnung an und setze Opacities
  gridItems.forEach(item => {
    item.style.opacity = '1';
    col2Content.appendChild(item);
  });
}




// Indexeinträge mit Sortierinfos zu Jahren, Nutzerzahlen, alphabetischer Ordnung, continent, aktueller Marktwert
const timelineData = [
    { id: "BA", year: 2025, categories: ["E"] },
    { id: "PL", year: 2025, categories: ["F"] },
    { id: "PP", year: 2025, categories: ["S", "F", "B"] },
    { id: "SMI", year: 2026, categories: ["W"] },
    { id: "M", year: 2025, categories: ["T"] },
    { id: "VR", year: 2024, categories: ["B", "F", "E", "W"] },
    { id: "RWTH", year: 2023, categories: ["B", "S", "F"] },
    { id: "SR", year: 2024, categories: ["M", "S", "B"] },
    { id: "NR", year: 2023, categories: ["F"] },
    { id: "WTP", year: 2023, categories: ["E"] },
    { id: "KM", year: 2024, categories: ["F"] },
    { id: "S", year: 2024, categories: ["F"] },
    { id: "I", year: 2025, categories: ["F"] },
    { id: "PX", year: 2024, categories: ["T"] },
    { id: "A", year: "2019+", categories: [] },    
    
  ];


timelineData.forEach(item => {
  const btn = document.querySelector(`.timeline-item[data-id="${item.id}"]`);
  if (btn) {
    btn.setAttribute('data-year', item.year);
  }
});



  // Sortierfunktion
  function sortTimeline(criteria, yearAscending = false) {
    const timelineList = document.getElementById('timeline');
    const items = Array.from(timelineList.querySelectorAll('li'));

    const enriched = items.map(li => {
      const id = li.querySelector('.timeline-item').getAttribute('data-id');
      const data = timelineData.find(d => d.id === id);
      return {
        li,
        continent: data ? data.continent : 'other',
      };
    });

    const isContinentFilter = (criteria === 'european' || criteria === 'asian' || criteria === 'us-american');

    if (isContinentFilter) {
      const key = criteria === 'european' ? 'europe' : (criteria === 'asian' ? 'asia' : 'us');

      // Sortiere so, dass passende Einträge oben stehen (sekundär nach Jahr)
      enriched.sort((a, b) => {
        const aMatch = a.continent === key ? 0 : 1;
        const bMatch = b.continent === key ? 0 : 1;
        if (aMatch !== bMatch) return aMatch - bMatch;
        return b.year - a.year;
      });

      // Zeige nur passende Einträge, andere ausblenden
      enriched.forEach(e => {
        if (e.continent === key) {
          e.li.style.display = ''; // sichtbar
          timelineList.appendChild(e.li);
        } else {
          e.li.style.display = 'none'; // ausblenden
        }
      });

    } else {
      // Bei normalen Sortierungen: alle Items wieder sichtbar machen und wie gewohnt sortieren
      enriched.sort((a, b) => {
        if (criteria === 'year') {
          return yearAscending ? a.year - b.year : b.year - a.year;
        }
        if (criteria === 'users') return b.users - a.users;
        if (criteria === 'alphabet') return a.alphabet - b.alphabet;
        if (criteria === 'value') return a.value - b.value;
        return 0;
      });

      enriched.forEach(e => {
        e.li.style.display = ''; // sicherstellen, dass sichtbar
        timelineList.appendChild(e.li);
      });
    }
  }



    // Handle hover events for timeline items
    timeline.addEventListener('mouseover', (e) => {
      const btn = e.target.closest('.timeline-item');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      updateImage(id);
    });

    // Add mouseout handler to hide image
    timeline.addEventListener('mouseout', (e) => {
      hideImage();
    });

    timeline.addEventListener('click', (e) => {
      const btn = e.target.closest('.timeline-item');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      showDetail(id, btn.textContent.trim());
    });

    detailClose.addEventListener('click', hideDetail);

    function hideImage() {
      dynamicImage.classList.remove('visible');
    }

function updateImage(id) {
  dynamicImage.classList.remove('visible');
  setTimeout(() => {
    // Versuche nacheinander: PNG → JPG → GIF
    const tryImageFormats = ['png', 'gif', 'jpg'];
    let formatIndex = 0;

    function tryNextFormat() {
      if (formatIndex >= tryImageFormats.length) {
        // Keine der Formate gefunden
        dynamicImage.src = '';
        return;
      }

      const format = tryImageFormats[formatIndex];
      const testImg = new Image();
      
      testImg.onload = () => {
        dynamicImage.src = `bilder/${id}.${format}`;
        dynamicImage.classList.add('visible');
      };
      
      testImg.onerror = () => {
        formatIndex++;
        tryNextFormat();
      };
      
      testImg.src = `bilder/${id}.${format}`;
    }

    tryNextFormat();
  }, 200);
}

    function showDetail(id, fallbackTitle) {
      const activeBtn = document.querySelector(`.timeline-item[data-id="${id}"]`);
      const wasAlreadyActive = activeBtn && activeBtn.classList.contains('active');

      // Wenn bereits aktiv: schließen statt zu wechseln
      if (wasAlreadyActive) {
        hideDetail();
        return;
      }

      // Entferne aktive Klasse von vorherigem Item
      document.querySelectorAll('.timeline-item.active').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Setze aktive Klasse auf neues Item
      if (activeBtn) {
        activeBtn.classList.add('active');
      }
      
      const entry = DETAILS[id];
      detailTitle.textContent = entry ? entry.title : fallbackTitle || 'Detail';
      detailContent.innerHTML = entry ? entry.html : '<p></p>';

      // Reset Scroll VOR dem Anzeigen
      detailContent.scrollTop = 0;

      detail.classList.add('active');
      col2.classList.add('col-hide');
      col3.classList.add('col-hide');

      // nach dem Rendern scrollen
      requestAnimationFrame(() => {
        // 1. inneren Scroll-Container nach oben
        detailContent.scrollTop = 0;

        // 2. Spalte im Fenster nach oben holen
        detail.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });

      detailClose.focus();

      
      // Reset Detail-Filter auf "alles"
      const defaultFilter = 'all';
      document.querySelectorAll('.detail-header .filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === defaultFilter);
      });
      applyDetailFilter(defaultFilter);
    }

    function hideDetail() {
      // Entferne aktive Klasse von timeline-item
      document.querySelectorAll('.timeline-item.active').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Reset Scroll vor dem Schließen
      detailContent.scrollTop = 0;
      
      detail.classList.remove('active');
      col2.classList.remove('col-hide');
      col3.classList.remove('col-hide');
    }

    // --- Detail-Header Filter (Bild / Text / alles) ---
    const detailFilterBtns = document.querySelectorAll('.detail-header .filter-btn');

    detailFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        detailFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyDetailFilter(btn.dataset.filter);
      });
    });

    function applyDetailFilter(filter) {
      const container = detailContent.querySelector('.index-detail') || detailContent;
      if (!container) return;

      const imageEls = container.querySelectorAll('img, picture, svg, iframe, video, figcaption');
      const textEls = container.querySelectorAll('p, h1, h2, h3, h4, h5, blockquote, ul, ol, li');

      if (filter === 'all') {
        container.querySelectorAll('*').forEach(el => el.style.display = '');
      } else if (filter === 'image') {
        imageEls.forEach(el => el.style.display = '');
        textEls.forEach(el => el.style.display = 'none');
        container.querySelectorAll('figcaption').forEach(el => el.style.display = '');
      } else if (filter === 'text') {
        imageEls.forEach(el => el.style.display = 'none');
        textEls.forEach(el => el.style.display = '');
      }
    }


      const gridItems = document.querySelectorAll('#col2 .grid-item');

gridItems.forEach(item => {
  const id = item.getAttribute('data-id');
  const btn = document.querySelector(`.timeline-item[data-id="${id}"]`);
  
  // Setze data-title für CSS ::after Beschriftung
  if (btn) {
    item.setAttribute('data-title', btn.textContent.trim());
  }
  
  item.addEventListener('click', () => {
    const id = item.getAttribute('data-id');
    const btn = document.querySelector(`.timeline-item[data-id="${id}"]`);
    if (btn) {
      showDetail(id, btn.textContent.trim());
    }
  });
});

    // Mobile Buttons Toggle für Einklappen
    const isMobileView = window.innerWidth <= 768;
    if (isMobileView) {
      const buttons = document.querySelectorAll('.impressum-button, .about-button, .callme-button');
      buttons.forEach((btn, index) => {
        // Nur erste Button expanded, rest collapsed
        if (index > 0) {
          btn.classList.add('collapsed');
          btn.style.maxHeight = '45px';
          btn.style.overflow = 'hidden';
        } else {
          btn.style.maxHeight = '100px';
        }

        btn.addEventListener('click', (e) => {
          // Nicht clicken wenn auf Link geklickt
          if (e.target.closest('h2')) {
            e.stopPropagation();
            btn.classList.toggle('collapsed');
            btn.style.maxHeight = btn.classList.contains('collapsed') ? '45px' : '100px';
          }
        });

        // Click auf h2 für Toggle
        const h2 = btn.querySelector('h2');
        if (h2) {
          h2.style.cursor = 'pointer';
          h2.addEventListener('click', () => {
            btn.classList.toggle('collapsed');
            btn.style.maxHeight = btn.classList.contains('collapsed') ? '45px' : '100px';
          });
        }
      });
    }



    // Mobile: Zeige About und Impressum Sektionen statt Buttons
    const isMobile = window.innerWidth <= 1000;

    if (isMobile) {
      const aboutButton = document.querySelector('.about-button');
      const impressumButton = document.querySelector('.impressum-button');
      const callmeButton = document.querySelector('.callme-button');
      const mobileAboutSection = document.querySelector('.mobile-about-section');
      const mobileImpressumSection = document.querySelector('.mobile-impressum-section');

      // About Button: zeige About Section
      if (aboutButton && mobileAboutSection) {
        aboutButton.addEventListener('click', () => {
          mobileAboutSection.style.display = mobileAboutSection.style.display === 'none' ? 'block' : 'none';
          if (mobileAboutSection.style.display === 'block') {
            mobileImpressumSection.style.display = 'none';
          }
        });
      }

      // Impressum Button: zeige Impressum Section
      if (impressumButton && mobileImpressumSection) {
        impressumButton.addEventListener('click', () => {
          mobileImpressumSection.style.display = mobileImpressumSection.style.display === 'none' ? 'block' : 'none';
          if (mobileImpressumSection.style.display === 'block') {
            mobileAboutSection.style.display = 'none';
          }
        });
      }

      // Callme Button: gehe zu callme.html
      if (callmeButton) {
        callmeButton.addEventListener('click', () => {
          window.location.href = 'callme.html';
        });
      }
    } else {
      // Desktop: Original Verhalten
      const aboutButton = document.querySelector('.about-button');
      if (aboutButton) {
        const h2 = aboutButton.querySelector('h2');
        if (h2 && h2 !== event?.target) {
          aboutButton.addEventListener('click', (e) => {
            if (!aboutButton.classList.contains('collapsed') && window.innerWidth > 768) {
              window.location.href = 'about.html';
            }
          });
        }
      }

      const callmeButton = document.querySelector('.callme-button');
      if (callmeButton) {
        const h2 = callmeButton.querySelector('h2');
        if (h2 && h2 !== event?.target) {
          callmeButton.addEventListener('click', (e) => {
            if (!callmeButton.classList.contains('collapsed') && window.innerWidth > 768) {
              window.location.href = 'callme.html';
            }
          });
        }
      }

      const impressumButton = document.querySelector('.impressum-button');
      if (impressumButton) {
        const h2 = impressumButton.querySelector('h2');
        if (h2 && h2 !== event?.target) {
          impressumButton.addEventListener('click', (e) => {
            if (!impressumButton.classList.contains('collapsed') && window.innerWidth > 768) {
              window.location.href = 'impressum.html';
            }
          });
        }
      }
    }


    // Wiggle Animation für callme-button jede Minute
    const callmeButtonElement = document.querySelector('.callme-button');
    if (callmeButtonElement) {
      setInterval(() => {
        callmeButtonElement.classList.add('wiggle');
        setTimeout(() => {
          callmeButtonElement.classList.remove('wiggle');
        }, 400);
      }, 20000); // 60000ms = 1 Minute
    }


        document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    });



    

    // Timeline-Reihenfolge mit Grid-Items synchronisieren
function syncTimelineWithGrid() {
  // Extrahiere die Ordnung der Grid-Items
  const gridOrder = Array.from(document.querySelectorAll('#col2 .grid-item'))
    .map(item => item.getAttribute('data-id'));

  // Speichern als ursprüngliche Ordnung (für Filterung später)
  window.originalGridOrder = gridOrder;

  // Hole alle Timeline-Items
  const timelineList = document.getElementById('timeline');
  const timelineItems = Array.from(timelineList.querySelectorAll('li'));

  // Sortiere Timeline-Items nach Grid-Ordnung
  timelineItems.sort((a, b) => {
    const idA = a.querySelector('.timeline-item').getAttribute('data-id');
    const idB = b.querySelector('.timeline-item').getAttribute('data-id');
    
    const indexA = gridOrder.indexOf(idA);
    const indexB = gridOrder.indexOf(idB);
    
    return indexA - indexB;
  });

  // Reorder Timeline im DOM
  timelineItems.forEach(item => {
    timelineList.appendChild(item);
  });
}

// Beim Laden ausführen
document.addEventListener('DOMContentLoaded', () => {
  syncTimelineWithGrid();

  // Rest des Codes...
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
});




// Lazyloading mit Blur
document.querySelectorAll('img').forEach(img => {
  img.loading = 'lazy';
});

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.addEventListener('load', () => {
    img.classList.add('loaded');
  });
});