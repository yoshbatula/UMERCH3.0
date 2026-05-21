import './bootstrap'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { router } from '@inertiajs/react'
import axios from 'axios'

let inactivityTimer = null;
let warningTimer = null;
let isAuthenticated = false;
let modalEl = null;
let warningSeconds = 0;

const MODAL_WARNING_TIME = 5; // seconds before logout to show warning

function createModal() {
    const overlay = document.createElement('div');
    overlay.id = 'inactivity-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-family:sans-serif;';
    overlay.innerHTML = `
        <div style="background:#F6F6F6;box-shadow:0 4px 20px rgba(0,0,0,0.15);border-radius:16px;padding:20px;text-align:center;max-width:380px;width:90%;">
            <div style="padding:20px 10px;display:flex;flex-direction:column;align-items:center;">
                <div style="font-size:18px;font-weight:600;color:black;margin-bottom:16px;">Are you still there?</div>
                <p style="margin:0 0 20px;font-size:14px;color:#555;">You'll be logged out in <span id="inactivity-countdown" style="color:#9C0306;font-weight:bold;">5</span> seconds due to inactivity.</p>
                <div style="display:flex;flex-direction:row;gap:12px;">
                    <button id="inactivity-stay-btn" style="background:#9C0306;color:white;border:none;border-radius:5px;padding:10px 0;font-size:14px;cursor:pointer;font-weight:600;width:120px;height:40px;">I'm here</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    modalEl = overlay;

    document.getElementById('inactivity-stay-btn').addEventListener('click', dismissModal);
}

function dismissModal() {
    if (modalEl) {
        modalEl.remove();
        modalEl = null;
    }
    if (warningTimer) {
        clearInterval(warningTimer);
        warningTimer = null;
    }
    resetInactivityTimer(10000);
}

function showWarning() {
    if (modalEl) return;
    warningSeconds = MODAL_WARNING_TIME;
    createModal();
    const countdownEl = document.getElementById('inactivity-countdown');
    warningTimer = setInterval(() => {
        warningSeconds--;
        if (countdownEl) countdownEl.textContent = warningSeconds;
        if (warningSeconds <= 0) {
            clearInterval(warningTimer);
            warningTimer = null;
            if (modalEl) modalEl.remove();
            modalEl = null;
            doLogout();
        }
    }, 1000);
}

function doLogout() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    axios.post('/logout').catch(() => {}).finally(() => {
        window.location.href = '/';
    });
}

function resetInactivityTimer(timeout = 10000) {
    if (warningTimer) {
        clearInterval(warningTimer);
        warningTimer = null;
    }
    if (modalEl) {
        modalEl.remove();
        modalEl = null;
    }
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (!isAuthenticated) return;
    inactivityTimer = setTimeout(showWarning, timeout - (MODAL_WARNING_TIME * 1000));
}

function setupActivityListeners(timeout) {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handler = () => resetInactivityTimer(timeout);
    events.forEach(event => window.addEventListener(event, handler));
}

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx')
        return pages[`./Pages/${name}.jsx`]()
    },
    setup({ el, App, props }) {
        isAuthenticated = !!props?.initialPage?.props?.auth?.user;

        router.on('success', (event) => {
            isAuthenticated = !!event.detail.page?.props?.auth?.user;
            if (isAuthenticated) resetInactivityTimer(10000);
        });

        setupActivityListeners(10000);

        createRoot(el).render(<App {...props} />)
    },
})
