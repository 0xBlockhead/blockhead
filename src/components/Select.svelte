<script
	lang="ts"
	generics="_Item"
>
	// Customizable native select: the first child is a button with
	// <selectedcontent></selectedcontent> as its only child (MDN). The browser clones the
	// selected option into selectedcontent.
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
	// https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select
	// IDs


	const _id = $props.id()


	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'

	// State
	let {
		items,
		value = $bindable(),
		getItemId,
		getItemLabel,
		placeholder,
		allowDeselect,
		id,
		ariaLabel,
		...selectProps
	}: WithRest<
		{
			items: readonly _Item[]
			value?: _Item | undefined
			getItemId: (item: _Item) => string
			getItemLabel: (item: _Item) => string
			placeholder?: string
			allowDeselect?: boolean
			id?: string
			ariaLabel?: string
		},
		SvelteHTMLElements['select']
	> = $props()

	const normalizedItems = $derived(
		items.map((item) => ({
			item,
			id: getItemId(item),
			label: getItemLabel(item),
		})),
	)
	const valueStr = $derived(
		value !== undefined ? getItemId(value) : '',
	)


	// Actions


	$effect(() => {
		if (
			valueStr === '' &&
			!allowDeselect &&
			normalizedItems.length > 0 &&
			value === undefined
		)
			value = normalizedItems[0].item
	})
</script>


<select
	id={id ?? _id}
	class="select-native"
	bind:value={
		() => valueStr,
		(_value) => {
			if (_value === '' && allowDeselect) {
				value = undefined
				return
			}

			const found = normalizedItems.find((item) => item.id === _value)
			if (found !== undefined)
				value = found.item
		}
	}
	aria-label={ariaLabel}
	data-row
	{...selectProps}
>
	<button
		type="button"
		data-button="unstyled"
	>
		<selectedcontent></selectedcontent>
	</button>
	{#if placeholder !== undefined}
		<option value="" disabled={!allowDeselect}>{placeholder}</option>
	{/if}

	{#each normalizedItems as item (item.id)}
		<option value={item.id}>{item.label}</option>
	{/each}
</select>
