/**
 * The showcase code.
 *
 * These are not invented snippets. `SHOWCASE_SOURCE` is the real
 * `examples/todo/src/components/TodoInput.vx` from the Velox repository,
 * transcribed verbatim so the landing page cannot drift into describing a
 * framework that does not exist.
 *
 * `SHOWCASE_GENERATED` is a SIMPLIFIED rendering of what velox-sfc emits for
 * that file — structurally faithful (a render fn, a resolve fn, the STYLE
 * constant) but abridged. It is labelled as simplified wherever it appears,
 * because presenting a plausible-looking but invented function signature as
 * compiler output would be exactly the kind of overclaim this site exists to
 * avoid.
 */

/** Verbatim from examples/todo/src/components/TodoInput.vx. */
export const SHOWCASE_SOURCE = `<template>
  <div class="todo-input">
    <input type="text" class="input"
           :value="value" :placeholder="placeholder" @input="on_input" />
  </div>
</template>

<script setup>
use velox_core::signal::Signal;

pub struct Props {
    pub value: String,
    pub placeholder: String,
}

pub struct State {
    pub props: Props,
    pub draft: std::rc::Rc<Signal<String>>,
}

impl State {
    pub fn new() -> Self {
        Self {
            props: Props {
                value: String::new(),
                placeholder: String::from("What needs to be done?"),
            },
            draft: velox_core::signal!(draft = String::new()),
        }
    }

    pub fn on_input(&self, payload: &str) {
        self.draft.set(payload.to_string());
    }
}
</script>

<style scoped>
.todo-input {
    display: flex;
    flex: 0 1 70%;
    width: 70%;
    min-width: 0;
    align-items: center;
}
.input {
    flex: 1;
    width: 100%;
    min-width: 0;
    height: 34px;
    padding: 6px 10px;
    border: 1px solid #334155;
    border-radius: 6px;
    background: #1e293b;
    color: #e2e8f0;
    font-size: 14px;
}
</style>`;

/**
 * Simplified. Structurally faithful to velox-sfc's Render mode: it emits a
 * render function taking a state Arc, a resolve function for bound
 * expressions, the on_event dispatcher, and the scoped CSS as a STYLE const.
 */
export const SHOWCASE_GENERATED = `// Simplified. The real output also carries make_resolve,
// make_on_event and the scoped-CSS transform.

pub fn render_with_state(
    state: std::sync::Arc<script_rs::State>,
    resolve: impl Fn(&str) -> String,
) -> VNode {
    VNode::Element {
        tag: "div".into(),
        props: Props::from_class("todo-input"),
        children: vec![VNode::Element {
            tag: "input".into(),
            props: Props::new()
                .set("type", "text")
                .set("class", "input")
                // :value is resolved from state on every frame
                .set("value", resolve("value"))
                .set("placeholder", resolve("placeholder"))
                // @input is dispatched to the root handler
                .set("on:input", "on_input"),
            children: vec![],
        }],
    }
}

// The scoped stylesheet, with [data-v-<hash>] appended to every selector.
pub const STYLE: &str = r#"\
.todo-input[data-v-a1b2]{display:flex;flex:0 1 70%;...}
.input[data-v-a1b2]{flex:1;width:100%;min-width:0;...}
"#;`;

/** How a parent imports and binds the component. */
export const SHOWCASE_USAGE = `<template>
  <TodoInput
    :value="draft"
    :placeholder="input_placeholder"
    @input="on_input"
  />
</template>

<script setup>
import TodoInput from './components/TodoInput.vx'

pub struct State {
    pub todoinput: Arc<super::todoinput::script_rs::State>,
}

impl State {
    // Bound props arrive here; the handler name matches the child's
    // on:input attribute, so the dispatch lands without extra wiring.
    pub fn on_input(&self, payload: &str) {
        self.todoinput.on_input(payload)
    }
}
</script>`;

/** The quick-start snippet used on the landing CTA and in the docs. */
export const QUICK_START = `cargo install --path velox-cli --force

velox init my-app
cd my-app

velox lint src/
velox dev`;