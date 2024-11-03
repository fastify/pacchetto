<template>
	<h1 class="title"><img src="/fastify.svg" alt="Fastify">Fastify Package Generator</h1>
	<div class="panes">
		<pre class="code">{{ json }}</pre>
		<div class="controls">
			<div class="top">
				<h2><i>Full stack</i>, you say? What do you need?</h2>
				<div class="categories">
					<i-button
						v-for="cat in categories"
						:class="{selected: cat === selectedCat}"
						@click="setSelectedCat(cat)"
						color="primary">
						{{ cat }}
					</i-button>
				</div>
				<div class="plugins">
					<div class="plugin" v-for="(plugin, i) in plugins[selectedCat]">
						<div class="left">
							<i-checkbox v-model="plugins[selectedCat][i].checked" />
						</div>
						<div class="right">
							<p class="name"><a :href="plugin.homepage" target="_blank">{{ plugin.name }}</a></p>
							<p class="description">{{ plugin.description }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.title {
	margin: 1em;
}
.title img {
	top: -0.2em;
	margin-right: 0.3em;
}
.panes {
	display: flex;
	flex-direction: row;
	width: calc(100% - 2em);
	margin: 2em;
	gap: 2.5em;
}
.code {
	padding: 1.2em;
	font-size: 1.2em;
	font-weight: bold;
	width: calc(50% - 3em);
	height: 80vh;
	flex-shrink: 1;
	border: 1px solid #fff;
  font-family: monospace;
  white-space: pre;
}
.controls {
	width: calc(50% - 3em);
}
.controls h2 {
	margin: 0;
	font-size: 1.5em;
	width: 100%;
}
.categories {
	margin-top: 1em;
	display: flex;
	gap: 0.5em;
	width: calc(100% - 2em);
	flex-wrap: wrap;
}
.categories :deep(.button) {
	font-size: 0.9em;
	font-weight: bold;
	padding: 0.5em;
	display: block !important;
	border-radius: 30px !important;
}
.categories :deep(.button).selected {
	background: #555;
	border: #555;
}
.plugins {
	margin-top: 1em;
	width: 100%;
}
.plugin {
	display: flex;
	flex-direction: row;
	margin-bottom: 0.5em;
}
.plugin .left {
	padding-top: 0.3em;
}
.plugin .right p {
	margin: 0;
}
.plugin .right .name {
	font-weight: bold;
}
</style>

<script>
import { ref, computed } from 'vue'
import pluginData from '../data.json'

export const path = '/'

export default {
	setup () {
		const selectedCat = ref(false)
		const setSelectedCat = (cat) => {
			selectedCat.value = cat
		}
		const plugins = ref(JSON.parse(JSON.stringify(pluginData)))
		const categories = Object.keys(plugins.value)
		const json = computed(() => {
			const dependencies = {}
			for (const cat of Object.keys(plugins.value)) {
				for (const plugin of plugins.value[cat]) {
					if (plugin.checked) {
						dependencies[plugin.name] = plugin.version
					}
				}
			}
			return JSON.stringify({ dependencies }, null, 2)
		})
		return {
			json,
			plugins,
			categories,
			selectedCat,
			setSelectedCat
		}
	}
}
</script>