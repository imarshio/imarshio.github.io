<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId } from "vue";

const props = defineProps<{
  language: string;
  filename: string;
  code: string;
}>();

const editor = ref<HTMLIFrameElement>();
const panelId = `code-runner-${useId()}`;
const expanded = ref(false);
const activated = ref(false);
const loaded = ref(false);
const synced = ref(false);
const syncFailed = ref(false);
let retry: ReturnType<typeof setInterval> | undefined;
let deadline: ReturnType<typeof setTimeout> | undefined;
const origin = "https://onecompiler.com";
const editorUrl = computed(
  () => `${origin}/embed/${props.language}?listenToEvents=true&codeChangeEvent=true&hideLanguageSelection=true&hideNew=true&hideTitle=true`,
);
const label = computed(() => ({
  python: "Python",
  nodejs: "Node.js",
  javascript: "JavaScript",
  html: "HTML / CSS / JavaScript",
  java: "Java",
})[props.language] ?? props.language);

function populateCode() {
  editor.value?.contentWindow?.postMessage({
    eventType: "populateCode",
    language: props.language,
    files: [{ name: props.filename, content: props.code }],
  }, origin);
}

function stopSync() {
  clearInterval(retry);
  clearTimeout(deadline);
}

function onLoad() {
  loaded.value = true;
  synced.value = false;
  syncFailed.value = false;
  stopSync();
  // The iframe load event can precede the editor's message listener.
  // Retry only until its code-change event acknowledges the article source.
  populateCode();
  retry = setInterval(populateCode, 500);
  deadline = setTimeout(() => {
    stopSync();
    syncFailed.value = true;
  }, 10000);
}

function toggleEditor() {
  expanded.value = !expanded.value;
  if (expanded.value) activated.value = true;
}

function onEditorMessage(event: MessageEvent) {
  if (event.origin !== origin || event.source !== editor.value?.contentWindow) return;
  if (synced.value) return;
  if (Array.isArray(event.data?.files) && event.data.files.some((file: { name: string; content: string } | null) =>
    file?.name === props.filename && file.content === props.code,
  )) {
    synced.value = true;
    stopSync();
  }
}

onMounted(() => window.addEventListener("message", onEditorMessage));
onUnmounted(() => {
  stopSync();
  window.removeEventListener("message", onEditorMessage);
});
</script>

<template>
  <div class="code-runner">
    <div class="code-runner-source">
      <slot />
      <button
        type="button"
        class="code-runner-toggle"
        :aria-label="`${expanded ? '收起' : '在线编辑并运行'} ${label}`"
        :aria-expanded="expanded"
        :aria-controls="panelId"
        :title="expanded ? '收起编辑器' : '在线编辑并运行'"
        @click="toggleEditor"
      >{{ expanded ? "收起" : "run" }}</button>
    </div>
    <section v-show="expanded" :id="panelId" class="code-runner-editor" :aria-label="`${label} 在线执行器`">
    <p class="code-runner-note">
      由 OneCompiler 提供，代码将发送至第三方服务。修改后点击 Run 运行，请勿输入密钥或私密数据。
      <a :href="`${origin}/${language}`" target="_blank" rel="noopener noreferrer">在新窗口打开</a>
      <span>（新窗口需自行粘贴代码）</span>
    </p>
    <p v-if="activated && !synced && !syncFailed" role="status">正在加载编辑器并同步文章示例；如无法访问，请使用上方链接。</p>
    <p v-if="syncFailed" role="status">未能确认示例同步，请核对编辑器内容；可重新载入示例，或复制上方代码后粘贴运行。</p>
    <button v-if="loaded" type="button" class="code-runner-reset" @click="populateCode">重新载入文章示例（覆盖编辑内容）</button>
    <iframe
      v-if="activated"
      v-show="synced || syncFailed"
      ref="editor"
      :src="editorUrl"
      :title="`${label} 在线代码编辑器`"
      sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups"
      referrerpolicy="strict-origin-when-cross-origin"
      @load="onLoad"
    />
    </section>
  </div>
</template>

<style scoped>
.code-runner {
  margin: 0.75rem 0 1.5rem;
}

.code-runner-source {
  position: relative;
  display: flow-root;
}

.code-runner-source :deep(div[class*="language-"]) {
  margin-block: 0;
}

.code-runner-source :deep(div[class*="language-"]::before) {
  display: none;
}

.code-runner-source :deep(.vp-copy-code-button) {
  opacity: 1;
}

.code-runner-toggle {
  position: absolute;
  z-index: 5;
  top: 0.5em;
  right: 3.25rem;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 0;
  border-radius: 0.5rem;
  background: var(--code-c-bg, #ecf4fa);
  color: var(--vp-c-accent, #3eaf7c);
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}

.code-runner-toggle:hover {
  background: var(--copy-code-c-hover, #e0edf5);
}

.code-runner-toggle:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.code-runner-editor {
  margin-top: 0.75rem;
  border: 1px solid var(--vp-c-divider, #ddd);
  border-radius: 6px;
}

@media print {
  .code-runner-toggle,
  .code-runner-editor {
    display: none !important;
  }
}

.code-runner-note,
[role="status"] {
  margin: 0.5rem 1rem 1rem;
  font-size: 0.875rem;
}

.code-runner-reset {
  margin: 0 1rem 1rem;
  padding: 0.35rem 0.6rem;
  border: 1px solid currentColor;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}

iframe {
  display: block;
  width: 100%;
  height: 540px;
  border: 0;
  border-radius: 0 0 6px 6px;
  background: #fff;
}

@media (max-width: 600px) {
  iframe {
    height: 640px;
  }
}
</style>
