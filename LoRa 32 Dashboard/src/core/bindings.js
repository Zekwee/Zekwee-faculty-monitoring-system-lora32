
/* =========================================
   XUI Binding Engine
   xuiModel  → Two-way binding
   xuiBind   → Reactive display binding
   xuiForm   → Automatic form handler
========================================= */

export function xuiModel(state, key) {
  return `
    data-xui-model="${key}"
    value="${state.get()[key] ?? ""}"
  `;
}

export function xuiBind(state, key) {
  return `
    data-xui-bind="${key}"
  `;
}

export function xuiIf(condition) {
  return condition ? "" : "style=\"display:none\"";
}

export function xuiFor(list, renderFn) {
  return list.map(renderFn).join("");
}

export function xuiEach(object, renderFn) {
  if (typeof object !== "object" || object === null) return "";
  return Object.entries(object)
    .map(([key, value]) => renderFn(key, value))
    .join("");
}
export function xuiForm(state, onSubmit) {

  return function attachForm() {

    const models = document.querySelectorAll("[data-xui-model]");

    models.forEach(input => {
      const key = input.dataset.xuiModel;

      input.addEventListener("input", (e) => {
        const newState = { ...state.get() };
        newState[key] = e.target.value;
        state.set(newState);
      });
    });

    const form = document.querySelector("form");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(state.get());
      });
    }

    updateBindings(state);

    state.subscribe(() => {
      updateBindings(state);
    });
  };
}

function updateBindings(state) {

  const elements = document.querySelectorAll("[data-xui-bind]");
  elements.forEach(el => {
    const key = el.dataset.xuiBind;
    el.innerText = state.get()[key] ?? "";
  });

  const inputs = document.querySelectorAll("[data-xui-model]");

  inputs.forEach(input => {
    const key = input.dataset.xuiModel;
    input.value = state.get()[key] ?? "";
  });
}
