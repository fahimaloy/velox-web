// Velox counter example code (from actual examples/counter/src/App.vx)
export const VELOX_COUNTER_CODE = `<template>
  <div class="app">
    <h1 class="title">{{ title }}</h1>
    <div class="card">
      <p class="count">{{ count }}</p>
      <p class="status">{{ status }}</p>
      <div class="label-row">
        <span class="label-text">Label</span>
        <input class="label-input" v-model="label"/>
      </div>
      <div class="actions">
        <button class="btn inc" @click="increment">+1</button>
        <button class="btn dec" @click="decrement">-1</button>
        <button class="btn reset" @click="reset">Reset</button>
      </div>
    </div>
  </div>
</template>

<script setup>
use velox_core::ergonomics::Ref;

pub struct State {
    counter: Ref<i32>,
    label: Ref<String>,
}

impl State {
    pub fn new() -> Self {
        Self {
            counter: velox_core::r#ref!(0),
            label: velox_core::r#ref!(String::from("counter")),
        }
    }

    pub fn title(&self) -> String {
        String::from("Velox Counter")
    }

    pub fn count(&self) -> i32 {
        self.counter.get()
    }

    pub fn label(&self) -> String {
        self.label.get()
    }

    pub fn status(&self) -> String {
        if self.counter.get() > 0 {
            String::from("positive")
        } else {
            String::from("not positive")
        }
    }

    pub fn increment(&self) {
        self.counter.set(self.counter.get() + 1);
    }

    pub fn decrement(&self) {
        self.counter.set(self.counter.get() - 1);
    }

    pub fn reset(&self) {
        self.counter.set(0);
    }
}
</script>

<style scoped>
.app {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 6px 14px 20px;
    background: #0f172a;
    color: #f1f5f9;
    font-family: system-ui, -apple-system, sans-serif;
}
.title {
    display: block;
    margin: 0 0 8px 0;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
}
.card {
    display: block;
    width: 420px;
    margin: 0 auto;
    padding: 12px 14px;
    background: #1e293b;
    border-radius: 12px;
    text-align: center;
}
.count {
    display: block;
    margin: 0 0 4px 0;
    font-size: 34px;
    font-weight: 700;
    color: #38bdf8;
}
.status {
    display: block;
    margin: 0 0 6px 0;
    font-size: 13px;
    color: #94a3b8;
}
.label-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    margin: 0 0 8px 0;
}
.label-text {
    display: block;
    flex: 0 0 auto;
    font-size: 13px;
    color: #94a3b8;
}
.label-input {
    display: block;
    flex: 1 1 auto;
    min-width: 0;
    width: 220px;
    height: 26px;
    font-size: 14px;
}
.actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
}
.btn {
    flex: 0 1 120px;
    padding: 7px 12px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
    text-align: center;
    cursor: pointer;
}
.inc { background: #4ade80; }
.dec { background: #fbbf24; }
.reset { background: #94a3b8; }
</style>`;

// Qt "Hello World" - verbose C++
export const QT_HELLO_CODE = `#include <QApplication>
#include <QLabel>
#include <QWidget>
#include <QVBoxLayout>
#include <QPushButton>

class Counter : public QWidget {
    Q_OBJECT

public:
    Counter(QWidget *parent = nullptr) : QWidget(parent), count(0) {
        label = new QLabel("Count: 0", this);
        label->setAlignment(Qt::AlignCenter);
        label->setStyleSheet("font-size: 24px; font-weight: bold;");

        btnInc = new QPushButton("+1", this);
        btnDec = new QPushButton("-1", this);
        btnReset = new QPushButton("Reset", this);

        connect(btnInc, &QPushButton::clicked, this, &Counter::increment);
        connect(btnDec, &QPushButton::clicked, this, &Counter::decrement);
        connect(btnReset, &QPushButton::clicked, this, &Counter::reset);

        auto layout = new QVBoxLayout(this);
        layout->addWidget(label);
        layout->addWidget(btnInc);
        layout->addWidget(btnDec);
        layout->addWidget(btnReset);

        setLayout(layout);
        resize(300, 200);
    }

private slots:
    void increment() { count++; updateLabel(); }
    void decrement() { count--; updateLabel(); }
    void reset() { count = 0; updateLabel(); }

    void updateLabel() {
        label->setText(QString("Count: %1").arg(count));
    }

private:
    int count;
    QLabel *label;
    QPushButton *btnInc;
    QPushButton *btnDec;
    QPushButton *btnReset;
};

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);
    Counter counter;
    counter.show();
    return app.exec();
}

# CMakeLists.txt required
cmake_minimum_required(VERSION 3.16)
project(Counter)
find_package(Qt6 REQUIRED COMPONENTS Widgets)
add_executable(Counter main.cpp)
target_link_libraries(Counter PRIVATE Qt6::Widgets)`;

// GTK "Hello World" - GObject boilerplate
export const GTK_HELLO_CODE = `#include <gtk/gtk.h>

typedef struct {
    GtkWidget *label;
    int count;
} CounterApp;

static void update_label(CounterApp *app) {
    gchar *text = g_strdup_printf("Count: %d", app->count);
    gtk_label_set_text(GTK_LABEL(app->label), text);
    g_free(text);
}

static void on_increment(GtkButton *btn, CounterApp *app) {
    app->count++;
    update_label(app);
}

static void on_decrement(GtkButton *btn, CounterApp *app) {
    app->count--;
    update_label(app);
}

static void on_reset(GtkButton *btn, CounterApp *app) {
    app->count = 0;
    update_label(app);
}

static void activate(GtkApplication *gtk_app, gpointer user_data) {
    CounterApp *app = g_new0(CounterApp, 1);
    app->count = 0;

    GtkWidget *window = gtk_application_window_new(gtk_app);
    gtk_window_set_title(GTK_WINDOW(window), "GTK Counter");
    gtk_window_set_default_size(GTK_WINDOW(window), 300, 200);

    GtkWidget *box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 10);
    gtk_widget_set_margin_start(box, 20);
    gtk_widget_set_margin_end(box, 20);
    gtk_widget_set_margin_top(box, 20);
    gtk_widget_set_margin_bottom(box, 20);

    app->label = gtk_label_new("Count: 0");
    gtk_widget_set_halign(app->label, GTK_ALIGN_CENTER);
    PangoAttrList *attrs = pango_attr_list_new();
    PangoAttribute *attr = pango_attr_weight_new(PANGO_WEIGHT_BOLD);
    pango_attr_list_insert(attrs, attr);
    attr = pango_attr_size_new(24 * PANGO_SCALE);
    pango_attr_list_insert(attrs, attr);
    gtk_label_set_attributes(GTK_LABEL(app->label), attrs);
    pango_attr_list_unref(attrs);

    GtkWidget *btn_inc = gtk_button_new_with_label("+1");
    GtkWidget *btn_dec = gtk_button_new_with_label("-1");
    GtkWidget *btn_reset = gtk_button_new_with_label("Reset");

    g_signal_connect(btn_inc, "clicked", G_CALLBACK(on_increment), app);
    g_signal_connect(btn_dec, "clicked", G_CALLBACK(on_decrement), app);
    g_signal_connect(btn_reset, "clicked", G_CALLBACK(on_reset), app);

    gtk_box_append(GTK_BOX(box), app->label);
    gtk_box_append(GTK_BOX(box), btn_inc);
    gtk_box_append(GTK_BOX(box), btn_dec);
    gtk_box_append(GTK_BOX(box), btn_reset);
    gtk_window_set_child(GTK_WINDOW(window), box);
    gtk_window_present(GTK_WINDOW(window));
}

int main(int argc, char **argv) {
    GtkApplication *app = gtk_application_new("com.example.counter", G_APPLICATION_DEFAULT_FLAGS);
    g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);
    int status = g_application_run(G_APPLICATION(app), argc, argv);
    g_object_unref(app);
    return status;
}

// meson.build required
project('counter', 'c')
gtk_dep = dependency('gtk4')
executable('counter', 'main.c', dependencies: [gtk_dep])`;

// Win32 "Hello World" - raw API
export const WIN32_HELLO_CODE = `#include <windows.h>
#include <stdio.h>

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    static int count = 0;
    static HWND hLabel, hInc, hDec, hReset;
    char buf[32];

    switch (msg) {
        case WM_CREATE:
            hLabel = CreateWindow("STATIC", "Count: 0",
                WS_VISIBLE | WS_CHILD | SS_CENTER,
                50, 20, 200, 40, hwnd, NULL, NULL, NULL);
            SendMessage(hLabel, WM_SETFONT, (WPARAM)GetStockObject(DEFAULT_GUI_FONT), TRUE);

            hInc = CreateWindow("BUTTON", "+1",
                WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                50, 80, 80, 30, hwnd, (HMENU)1001, NULL, NULL);
            hDec = CreateWindow("BUTTON", "-1",
                WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                140, 80, 80, 30, hwnd, (HMENU)1002, NULL, NULL);
            hReset = CreateWindow("BUTTON", "Reset",
                WS_VISIBLE | WS_CHILD | BS_PUSHBUTTON,
                95, 120, 100, 30, hwnd, (HMENU)1003, NULL, NULL);
            break;

        case WM_COMMAND:
            switch (LOWORD(wParam)) {
                case 1001: count++; break;
                case 1002: count--; break;
                case 1003: count = 0; break;
            }
            sprintf(buf, "Count: %d", count);
            SetWindowText(hLabel, buf);
            break;

        case WM_DESTROY:
            PostQuitMessage(0);
            break;

        default:
            return DefWindowProc(hwnd, msg, wParam, lParam);
    }
    return 0;
}

int WINAPI WinMain(HINSTANCE hInst, HINSTANCE hPrev, LPSTR lpCmd, int nShow) {
    WNDCLASS wc = {0};
    wc.lpfnWndProc = WndProc;
    wc.hInstance = hInst;
    wc.lpszClassName = "CounterClass";
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    RegisterClass(&wc);

    HWND hwnd = CreateWindow("CounterClass", "Win32 Counter",
        WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, 350, 250,
        NULL, NULL, hInst, NULL);
    ShowWindow(hwnd, nShow);
    UpdateWindow(hwnd);

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}`;

// Flutter "Hello World" - Dart
export const FLUTTER_HELLO_CODE = `import 'package:flutter/material.dart';

void main() => runApp(CounterApp());

class CounterApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Counter',
      home: CounterPage(),
    );
  }
}

class CounterPage extends StatefulWidget {
  @override
  _CounterPageState createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _count = 0;

  void _increment() => setState(() => _count++);
  void _decrement() => setState(() => _count--);
  void _reset() => setState(() => _count = 0);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Flutter Counter')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Count: $_count',
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(onPressed: _increment, child: Text('+1')),
                SizedBox(width: 10),
                ElevatedButton(onPressed: _decrement, child: Text('-1')),
                SizedBox(width: 10),
                ElevatedButton(onPressed: _reset, child: Text('Reset')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// pubspec.yaml required
name: counter_app
dependencies:
  flutter:
    sdk: flutter`;

// Electron "Hello World" - shows the bloat
export const ELECTRON_HELLO_CODE = `// main.js - Node.js process
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// preload.js - Bridge (required for security!)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  increment: () => ipcRenderer.invoke('increment'),
  decrement: () => ipcRenderer.invoke('decrement'),
  reset: () => ipcRenderer.invoke('reset'),
});

// IPC handlers in main.js
let count = 0;
ipcMain.handle('increment', () => ++count);
ipcMain.handle('decrement', () => --count);
ipcMain.handle('reset', () => count = 0);

// index.html - Renderer process
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 40px; }
    .count { font-size: 48px; font-weight: bold; }
    button { padding: 12px 24px; font-size: 16px; margin: 0 8px; }
  </style>
</head>
<body>
  <h1>Electron Counter</h1>
  <div class="count" id="count">0</div>
  <div>
    <button onclick="increment()">+1</button>
    <button onclick="decrement()">-1</button>
    <button onclick="reset()">Reset</button>
  </div>
  <script>
    async function increment() { document.getElementById('count').textContent = await window.api.increment(); }
    async function decrement() { document.getElementById('count').textContent = await window.api.decrement(); }
    async function reset() { document.getElementById('count').textContent = await window.api.reset(); }
  </script>
</body>
</html>

// package.json - 150MB+ node_modules
{
  "name": "electron-counter",
  "main": "main.js",
  "scripts": { "start": "electron ." },
  "devDependencies": { "electron": "^28.0.0" }
}`;

// Tauri - Rust + WebView
export const TAURI_HELLO_CODE = `// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{command, Manager};

#[command]
fn increment(state: tauri::State<CounterState>) -> i32 {
    *state.count.lock().unwrap() += 1;
    *state.count.lock().unwrap()
}

#[command]
fn decrement(state: tauri::State<CounterState>) -> i32 {
    *state.count.lock().unwrap() -= 1;
    *state.count.lock().unwrap()
}

#[command]
fn reset(state: tauri::State<CounterState>) -> i32 {
    *state.count.lock().unwrap() = 0;
    0
}

struct CounterState {
    count: std::sync::Mutex<i32>,
}

fn main() {
    tauri::Builder::default()
        .manage(CounterState { count: std::sync::Mutex::new(0) })
        .invoke_handler(tauri::generate_handler![increment, decrement, reset])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// src/index.html - WebView (HTML/CSS/JS)
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="/main.js"></script>
  <style>
    body { font-family: system-ui; display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 40px; }
    .count { font-size: 48px; font-weight: bold; }
    button { padding: 12px 24px; font-size: 16px; margin: 0 8px; }
  </style>
</head>
<body>
  <h1>Tauri Counter</h1>
  <div class="count" id="count">0</div>
  <div>
    <button onclick="increment()">+1</button>
    <button onclick="decrement()">-1</button>
    <button onclick="reset()">Reset</button>
  </div>
</body>
</html>

// src/main.js - Frontend
import { invoke } from '@tauri-apps/api/core';

async function increment() {
  document.getElementById('count').textContent = await invoke('increment');
}
async function decrement() {
  document.getElementById('count').textContent = await invoke('decrement');
}
async function reset() {
  document.getElementById('count').textContent = await invoke('reset');
}

// Cargo.toml dependencies
[dependencies]
tauri = { version = "2.0", features = ["macos-private-api"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

// tauri.conf.json required for configuration`;

// Comparison table data
export const COMPARISON_DATA = [
  { feature: 'Language', electron: 'JS/TS', tauri: 'Rust + JS', flutter: 'Dart', velox: 'Rust (Vue syntax)' },
  { feature: 'Rendering', electron: 'Chromium', tauri: 'WebView', flutter: 'Skia', velox: 'Skia (native)' },
  { feature: 'Memory Safe', electron: '❌', tauri: '✅', flutter: '✅', velox: '✅ (Rust)' },
  { feature: 'Native APIs', electron: 'IPC Bridge', tauri: 'Commands', flutter: 'Channels', velox: 'Direct Rust' },
  { feature: 'Learning Curve', electron: 'Low', tauri: 'Medium', flutter: 'High', velox: 'Zero (Vue)' },
  { feature: 'Binary Size', electron: '~150 MB', tauri: '~10 MB', flutter: '~8 MB', velox: '~5 MB' },
  { feature: 'Hot Reload', electron: '✅', tauri: '✅', flutter: '✅', velox: 'Full Rebuild' },
  { feature: 'Single File', electron: '❌', tauri: '❌', flutter: '❌', velox: '✅ .vx SFC' },
];

// CLI commands for demo
export const DEMO_COMMANDS = [
  'cargo install velox-cli',
  'velox init myapp',
  'cd myapp',
  'velox dev',
];

// Ecosystem items
export const ECOSYSTEM_ITEMS = [
  { name: 'velox-cli', icon: '⚡', desc: 'Scaffold, build, dev, lint' },
  { name: 'velox-core', icon: '⚙️', desc: 'Signals, effects, lifecycle' },
  { name: 'velox-sfc', icon: '📝', desc: '.vx parser & codegen' },
  { name: 'velox-dom', icon: '🌳', desc: 'VNode, layout, diff' },
  { name: 'velox-style', icon: '🎨', desc: 'CSS parser, cascade' },
  { name: 'velox-renderer', icon: '🖼️', desc: 'Skia backend, events' },
  { name: 'VS Code', icon: '📝', desc: 'Syntax highlighting' },
  { name: 'Zed', icon: '⚡', desc: 'Language support' },
  { name: 'Neovim', icon: '💚', desc: 'Syntax & filetype' },
];

// Flutter Counter - minimal example
export const FLUTTER_COUNTER_CODE = `// main.dart
import 'package:flutter/material.dart';

void main() => runApp(const CounterApp());

class CounterApp extends StatelessWidget {
  const CounterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Counter',
      home: const CounterPage(),
    );
  }
}

class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _count = 0;

  void _increment() => setState(() => _count++);
  void _decrement() => setState(() => _count--);
  void _reset() => setState(() => _count = 0);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Flutter Counter')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Count: \$_count',
              style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(onPressed: _increment, child: const Text('+1')),
                const SizedBox(width: 10),
                ElevatedButton(onPressed: _decrement, child: const Text('-1')),
                const SizedBox(width: 10),
                ElevatedButton(onPressed: _reset, child: const Text('Reset')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// pubspec.yaml
name: flutter_counter
description: A minimal counter app
publish_to: 'none'
version: 1.0.0
environment:
  sdk: '>=3.0.0 <4.0.0'
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
flutter:
  uses-material-design: true`;

// Electron Counter - minimal example (4 files)
export const ELECTRON_COUNTER_FILES = {
  'main.js': `// main.js - Main process
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let count = 0;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile('index.html');
}

ipcMain.handle('increment', () => ++count);
ipcMain.handle('decrement', () => --count);
ipcMain.handle('reset', () => { count = 0; return 0; });

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });`,

  'preload.js': `// preload.js - Bridge (REQUIRED for security!)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  increment: () => ipcRenderer.invoke('increment'),
  decrement: () => ipcRenderer.invoke('decrement'),
  reset: () => ipcRenderer.invoke('reset'),
});`,

  'index.html': `<!-- index.html - Renderer process -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 40px; }
    .count { font-size: 48px; font-weight: bold; }
    button { padding: 12px 24px; font-size: 16px; margin: 0 8px; }
  </style>
</head>
<body>
  <h1>Electron Counter</h1>
  <div class="count" id="count">0</div>
  <div>
    <button onclick="increment()">+1</button>
    <button onclick="decrement()">-1</button>
    <button onclick="reset()">Reset</button>
  </div>
  <script>
    async function increment() { document.getElementById('count').textContent = await window.api.increment(); }
    async function decrement() { document.getElementById('count').textContent = await window.api.decrement(); }
    async function reset() { document.getElementById('count').textContent = await window.api.reset(); }
  </script>
</body>
</html>`,

  'package.json': `{
  "name": "electron-counter",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": { "start": "electron ." },
  "devDependencies": { "electron": "^28.0.0" }
}`
};

// Velox vs Vue feature comparison pairs
export const VUE_VELOX_FEATURES = [
  {
    id: 'reactive',
    title: 'Reactive State',
    vue: `// Vue 3
import { ref } from 'vue';

const count = ref(0);
const label = ref('counter');

// In template: {{ count }}`,
    velox: `// Velox
use velox_core::ergonomics::Ref;

pub struct State {
    counter: Ref<i32>,
    label: Ref<String>,
}

impl State {
    pub fn new() -> Self {
        Self {
            counter: velox_core::r#ref!(0),
            label: velox_core::r#ref!(String::from("counter")),
        }
    }
}
// In template: {{ count }}`,
    highlight: 'r#ref!(0) ≈ ref(0)',
  },
  {
    id: 'computed',
    title: 'Computed / Derived State',
    vue: `// Vue 3
import { computed } from 'vue';

const double = computed(() => count.value * 2);
const status = computed(() => count.value > 0 ? 'positive' : 'zero');`,
    velox: `// Velox
impl State {
    pub fn double(&self) -> i32 {
        self.counter.get() * 2
    }
    pub fn status(&self) -> String {
        if self.counter.get() > 0 {
            String::from("positive")
        } else {
            String::from("zero")
        }
    }
}
// In template: {{ double }}, {{ status }}`,
    highlight: 'Methods = computed properties',
  },
  {
    id: 'watchers',
    title: 'Watchers / Effects',
    vue: `// Vue 3
import { watchEffect, watch } from 'vue';

watchEffect(() => {
  console.log('Count changed:', count.value);
});

watch(count, (newVal, oldVal) => {
  // specific watcher
});`,
    velox: `// Velox
use velox_core::signal::Signal;
use velox_core::watch_effect;

// In component setup:
velox_core::watch_effect(|| {
    println!("Count changed: {}", state.counter.get());
});

// For specific watching, use effects in methods`,
    highlight: 'watch_effect(|| {}) ≈ watchEffect(() => {})',
  },
  {
    id: 'props',
    title: 'Props',
    vue: `// Vue 3 Child.vue
<script setup>
defineProps<{
  title: string;
  count: number;
  onIncrement: (n: number) => void;
}>();

// Usage: <Child :title="t" :count="c" @increment="fn" />`,
    velox: `// Velox Child.vx
<template>
  <div class="child">
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="on_increment(5)">+5</button>
  </div>
</template>

<script setup>
pub struct State {
    pub title: String,
    pub count: i32,
}

impl State {
    pub fn on_increment(&self, n: i32) {
        // Parent handles via method reference
    }
}

// Usage: <Child :title="t" :count="c" @increment="fn" />`,
    highlight: 'Props = struct fields. Same template syntax.',
  },
  {
    id: 'emits',
    title: 'Emits / Events',
    vue: `// Vue 3
<script setup>
const emit = defineEmits<{
  increment: [value: number];
  change: [old: number, new: number];
}>();

function doIncrement() {
  emit('increment', count.value);
  emit('change', oldVal, count.value);
}
</script>`,
    velox: `// Velox
// Parent defines handler method
impl State {
    pub fn on_child_increment(&self, value: i32) {
        // Handle child event
    }
    pub fn on_child_change(&self, old: i32, new: i32) {
        // Handle change
    }
}

// Child template emits via @event
// <Child @increment="on_child_increment" @change="on_child_change" />
// No defineEmits needed - direct method reference`,
    highlight: '@event="method" ≈ emit() — direct Rust call',
  },
  {
    id: 'lifecycle',
    title: 'Lifecycle Hooks',
    vue: `// Vue 3
<script setup>
import { onMounted, onUnmounted, onBeforeUpdate } from 'vue';

onMounted(() => {
  console.log('Component mounted');
  // Setup subscriptions, timers
});

onUnmounted(() => {
  console.log('Cleanup');
});

onBeforeUpdate(() => {
  // Before DOM update
});
</script>`,
    velox: `// Velox
use velox_core::lifecycle::{on_mounted, on_unmounted, on_before_update};

impl State {
    pub fn new() -> Self {
        on_mounted(|| {
            println!("Component mounted");
            // Setup subscriptions, timers
        });
        on_unmounted(|| {
            println!("Cleanup");
        });
        on_before_update(|| {
            // Before render
        });
        Self { ... }
    }
}
// Same hook names, same timing`,
    highlight: 'on_mounted / on_unmounted / on_before_update — identical',
  },
  {
    id: 'directives',
    title: 'Template Directives',
    vue: `// Vue 3
<template>
  <div v-if="show">Shown</div>
  <div v-else>Hidden</div>
  
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
  
  <input v-model="text" />
</template>`,
    velox: `// Velox — IDENTICAL SYNTAX
<template>
  <div v-if="show">Shown</div>
  <div v-else>Hidden</div>
  
  <ul>
    <li v-for="(item, idx) in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
  
  <input v-model="text" />
</template>

// v-if, v-else, v-else-if, v-for, v-model — all work the same`,
    highlight: 'v-if / v-else / v-for / v-model — 1:1 match',
  },
  {
    id: 'events',
    title: 'Event Listeners',
    vue: `// Vue 3
<template>
  <button @click="handleClick">Click</button>
  <input @input="onInput" @keydown.enter="onEnter" />
  <form @submit.prevent="onSubmit">
    <input @change="onChange" />
  </form>
</template>

<script setup>
function handleClick(e) { ... }
function onInput(e) { ... }
function onEnter(e) { ... }
function onSubmit(e) { ... }
function onChange(e) { ... }
</script>`,
    velox: `// Velox — Native Rust handlers
<template>
  <button @click="handle_click">Click</button>
  <input @input="on_input" @keydown.enter="on_enter" />
  <form @submit.prevent="on_submit">
    <input @change="on_change" />
  </form>
</template>

<script setup>
pub fn handle_click(&self) { ... }
pub fn on_input(&self, value: &str) { ... }
pub fn on_enter(&self) { ... }
pub fn on_submit(&self) { ... }
pub fn on_change(&self, value: &str) { ... }
</script>

// @click, @input, @keydown, @submit, @change — all supported
// Payload passed as &str or specific type`,
    highlight: '@event="method" — Rust fn(&str), not JS event object',
  },
  {
    id: 'styles',
    title: 'Scoped Styling',
    vue: `// Vue 3
<style scoped>
.card {
  padding: 24px;
  background: #1e293b;
  border-radius: 12px;
}
.btn {
  background: #0d6e66;
  color: white;
}
.card :deep(.child) { /* deep selector */ }
</style>

// CSS variables work too
<style scoped>
:root { --primary: #0d6e66; }
.card { background: var(--primary); }
</style>`,
    velox: `// Velox — Same syntax, native CSS
<style scoped>
.card {
  padding: 24px;
  background: #1e293b;
  border-radius: 12px;
}
.btn {
  background: #0d6e66;
  color: white;
}
/* Deep selector via >>> or :deep() */
.card >>> .child { /* or :deep(.child) */ }
</style>

// CSS variables — fully supported
<style scoped>
:root { --primary: #0d6e66; }
.card { background: var(--primary); }
</style>

// Flex/Grid — identical to CSS`,
    highlight: '<style scoped> — identical. CSS vars, flex, grid, deep selectors all work.',
  },
];

// Three-way dev comparison data
export const THREE_WAY_COMPARISON = {
  velox: {
    name: 'Velox',
    files: 1,
    loc: 52,
    binarySize: '~5 MB',
    syntaxFamiliarity: 100, // if you know Vue
    filesList: ['App.vx', 'Cargo.toml', 'src/main.rs', 'build.rs'],
    code: `<template>
  <div class="app">
    <h1>{{ title }}</h1>
    <div class="card">
      <p class="count">{{ count }}</p>
      <div class="actions">
        <button class="btn" @click="increment">+1</button>
        <button class="btn" @click="decrement">-1</button>
        <button class="btn" @click="reset">Reset</button>
      </div>
    </div>
  </div>
</template>

<script setup>
use velox_core::r#ref::Ref;

pub struct State { count: Ref<i32> }
impl State {
  pub fn new() -> Self { Self { count: r#ref!(0) } }
  pub fn title(&self) -> String { String::from("Counter") }
  pub fn count(&self) -> i32 { self.count.get() }
  pub fn increment(&self) { self.count.set(self.count.get() + 1); }
  pub fn decrement(&self) { self.count.set(self.count.get() - 1); }
  pub fn reset(&self) { self.count.set(0); }
}
</script>

<style scoped>
.app { padding: 24px; font-family: system-ui; text-align: center; }
.card { display: inline-block; padding: 20px; background: #1e293b; border-radius: 12px; }
.count { font-size: 36px; font-weight: 700; color: #38bdf8; margin: 0 0 16px; }
.actions { display: flex; gap: 8px; justify-content: center; }
.btn { padding: 10px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>`,
  },
  flutter: {
    name: 'Flutter',
    files: 2,
    loc: 78,
    binarySize: '~8 MB',
    syntaxFamiliarity: 15, // Dart + widget tree
    filesList: ['main.dart', 'pubspec.yaml'],
    code: `// main.dart (78 lines)
import 'package:flutter/material.dart';

void main() => runApp(const CounterApp());

class CounterApp extends StatelessWidget {
  const CounterApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Counter', home: const CounterPage(),
  );
}

class CounterPage extends StatefulWidget {
  const CounterPage({super.key});
  @override State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _count = 0;
  void _inc() => setState(() => _count++);
  void _dec() => setState(() => _count--);
  void _reset() => setState(() => _count = 0);

  @override Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Counter')),
    body: Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Text('Count: \$_count', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
      const SizedBox(height: 20),
      Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        ElevatedButton(onPressed: _inc, child: const Text('+1')),
        const SizedBox(width: 10),
        ElevatedButton(onPressed: _dec, child: const Text('-1')),
        const SizedBox(width: 10),
        ElevatedButton(onPressed: _reset, child: const Text('Reset')),
      ]),
    ])),
  );
}

// pubspec.yaml (12 lines)
name: counter
environment: { sdk: '>=3.0.0 <4.0.0' }
dependencies: { flutter: { sdk: flutter } }`},
  electron: {
    name: 'Electron',
    files: 4,
    loc: 124,
    binarySize: '~150 MB',
    syntaxFamiliarity: 80, // HTML/JS but IPC complexity
    filesList: ['main.js', 'preload.js', 'index.html', 'package.json'],
    code: `// main.js (32 lines)
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
let count = 0;
function createWindow() { /* ... */ }
ipcMain.handle('inc', () => ++count);
ipcMain.handle('dec', () => --count);
ipcMain.handle('reset', () => { count = 0; return 0; });
app.whenReady().then(createWindow);

// preload.js (12 lines) — REQUIRED bridge
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  inc: () => ipcRenderer.invoke('inc'),
  dec: () => ipcRenderer.invoke('dec'),
  reset: () => ipcRenderer.invoke('reset'),
});

// index.html (52 lines)
<!DOCTYPE html><html><head><style>/* CSS */</style></head>
<body><h1>Counter</h1><div id="count">0</div>
<button onclick="inc()">+1</button>...
<script>async function inc() { document.getElementById('count').textContent = await window.api.inc(); }</script>

// package.json (18 lines)
{ "main": "main.js", "scripts": { "start": "electron ." }, "devDependencies": { "electron": "^28" } }`},
};