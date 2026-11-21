'use strict';
const EMAIL = 'rnc93056@gmail.com';
const properties = [
  {id:1,title:'Student PG near campus',area:'Gomti Nagar, Lucknow',type:'PG',rent:6500,icon:'🏢',detail:'Furnished · Shared accommodation'},
  {id:2,title:'Private room for professionals',area:'Aliganj, Lucknow',type:'Room',rent:5000,icon:'🛏️',detail:'Basic furnishing · Independent room'},
  {id:3,title:'2 BHK family-friendly flat',area:'Indira Nagar, Lucknow',type:'Flat',rent:12000,icon:'🏠',detail:'2 bedrooms · Kitchen · Balcony'},
  {id:4,title:'Budget-friendly student room',area:'Jankipuram, Lucknow',type:'Room',rent:4000,icon:'🔑',detail:'Single occupancy · Basic facilities'},
  {id:5,title:'Shared PG for working people',area:'Hazratganj, Lucknow',type:'PG',rent:8000,icon:'🏙️',detail:'Furnished · Shared facilities'},
  {id:6,title:'Compact 1 BHK flat',area:'Mahanagar, Lucknow',type:'Flat',rent:9500,icon:'🏡',detail:'1 bedroom · Kitchen · Bathroom'}
];
const $ = id => document.getElementById(id);
const grid = $('propertyGrid'), search = $('searchInput'), type = $('typeFilter'), budget = $('budgetFilter');
let savedOnly = false;
let favourites = [];
try { favourites = JSON.parse(localStorage.getItem('confirmseat-favourites') || '[]'); if (!Array.isArray(favourites)) favourites = []; } catch { favourites = []; }
function showToast(message) { const toast = $('toast'); toast.textContent = message; toast.classList.add('show'); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2500); }
function renderProperties() {
  const query = search.value.trim().toLowerCase();
  const selectedType = type.value;
  const maxRent = Number(budget.value);
  const matches = properties.filter(p => (p.title + ' ' + p.area).toLowerCase().includes(query) && (selectedType === 'all' || p.type === selectedType) && p.rent <= maxRent && (!savedOnly || favourites.includes(p.id)));
  $('resultCount').textContent = `Showing ${matches.length} sample ${matches.length === 1 ? 'option' : 'options'}`;
  $('savedCount').textContent = favourites.length;
  if (!matches.length) { grid.innerHTML = `<div class="empty-state">${savedOnly ? 'You have not saved any sample properties yet.' : 'No sample properties match these filters. Try changing your search.'}</div>`; return; }
  grid.innerHTML = matches.map(p => `<article class="property"><div class="property-photo" aria-hidden="true">${p.icon}</div><div class="property-body"><span class="property-tag">SAMPLE ${p.type.toUpperCase()}</span><h3>${p.title}</h3><div class="property-location">📍 ${p.area}</div><div class="property-price">₹${p.rent.toLocaleString('en-IN')} <small>/ month</small></div><div class="property-detail">${p.detail}</div><div class="property-actions"><button class="small-button ${favourites.includes(p.id) ? 'saved' : ''}" data-save="${p.id}" type="button">${favourites.includes(p.id) ? '♥ Saved' : '♡ Save'}</button><a class="small-button" href="mailto:${EMAIL}?subject=${encodeURIComponent('Enquiry about ' + p.title)}">Ask about this</a></div></div></article>`).join('');
}
grid.addEventListener('click', event => { const button = event.target.closest('[data-save]'); if (!button) return; const id = Number(button.dataset.save); favourites = favourites.includes(id) ? favourites.filter(x => x !== id) : [...favourites, id]; try { localStorage.setItem('confirmseat-favourites', JSON.stringify(favourites)); } catch { showToast('Browser storage is unavailable.'); } renderProperties(); showToast(favourites.includes(id) ? 'Added to your saved list.' : 'Removed from your saved list.'); });
[search, type, budget].forEach(control => control.addEventListener('input', () => { savedOnly = false; $('savedToggle').classList.remove('active'); renderProperties(); }));
$('resetFilters').addEventListener('click', () => { search.value = ''; type.value = 'all'; budget.value = '999999'; savedOnly = false; $('savedToggle').classList.remove('active'); renderProperties(); });
$('savedToggle').addEventListener('click', () => { savedOnly = !savedOnly; $('savedToggle').classList.toggle('active', savedOnly); renderProperties(); });
const menuToggle = $('menuToggle'), mainNav = $('mainNav');
menuToggle.addEventListener('click', () => { const isOpen = mainNav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(isOpen)); menuToggle.textContent = isOpen ? '×' : '☰'; });
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mainNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.textContent = '☰'; }));
$('contactForm').addEventListener('submit', event => { event.preventDefault(); const name = $('visitorName').value.trim(); const visitorEmail = $('visitorEmail').value.trim(); const kind = $('enquiryType').value; const message = $('visitorMessage').value.trim(); const subject = encodeURIComponent(`ConfirmSeat enquiry: ${kind} — ${name}`); const body = encodeURIComponent(`Name: ${name}\nEmail: ${visitorEmail}\nEnquiry: ${kind}\n\nMessage:\n${message}`); window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`; });
$('year').textContent = new Date().getFullYear();
renderProperties();
