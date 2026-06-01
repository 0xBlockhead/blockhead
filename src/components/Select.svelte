<script
	lang="ts"
	generics="_Item"
>
	// Native <select> + optgroup. Customizable select: first child is <button> with
	// <selectedcontent></selectedcontent> as its only child (MDN). The browser clones the
	// selected option into selectedcontent; no Before/After in the button to avoid duplicate icons.
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
	// https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select
	// Types/constants
	import { stringify } from 'devalue'


	const defaultGetItemId = (item: _Item) => (
		typeof item === 'string' ?
			item
		: typeof item === 'number' || typeof item === 'boolean' ?
			String(item)
		: typeof item === 'bigint' ?
			item.toString()
		: item === undefined ?
			'null'
		: typeof item === 'object' ?
			stringify(item)
		:
			String(item)
	)


	// IDs


	const _id = $props.id()


	// State
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { Snippet } from 'svelte'

	let {
		items,
		value = $bindable(),
		getItemId = defaultGetItemId,
		getItemLabel = getItemId,
		getItemDisabled,
		getItemGroupId,
		getGroupLabel = (groupId: string) => groupId,
		Before,
		After,
		Item,
		children,
		placeholder,
		disabled,
		name,
		allowDeselect,
		id,
		ariaLabel,
		...selectProps
	}: WithRest<
		{
			items: readonly _Item[]
			value?: _Item | undefined
			getItemId?: (item: _Item) => string
			getItemLabel?: (item: _Item) => string
			getItemDisabled?: (item: _Item) => boolean
			getItemGroupId?: (item: _Item) => string
			getGroupLabel?: (groupId: string) => string
			Before?: Snippet
			After?: Snippet
			Item?: Snippet<[item: _Item, selected: boolean]>
			children?: Snippet
			placeholder?: string
			disabled?: boolean
			name?: string
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
			disabled: getItemDisabled ? getItemDisabled(item)
			:
				false,
		})),
	)
	const normalizedGroups = $derived(
		getItemGroupId ?
			Array.from(
				items.reduce((m, item) => {
					const gid = getItemGroupId(item)
					const arr = m.get(gid) ?? []
					arr.push(item)
					m.set(gid, arr)
					return m
				}, new Map<string, _Item[]>()),
			).map(([groupId, groupItems]) => ({
				id: groupId,
				label: getGroupLabel(groupId),
				items: groupItems.map((item) => ({
					item,
					id: getItemId(item),
					label: getItemLabel(item),
					disabled: getItemDisabled ? getItemDisabled(item)
					:
						false,
				})),
			}))
		:
			[],
	)
	const valueStr = $derived(
		value !== undefined ? String(getItemId(value))
		:
			'',
	)


	// Actions


	$effect(() => {
		if (
			valueStr === '' &&
			!(allowDeselect ?? false) &&
			normalizedItems.length > 0 &&
			value === undefined
		)
			value = normalizedItems[0].item
	})
</script>


{#if children}
	{@render children()}
{:else}
	<select
		id={id ?? _id}
		class="select-native"
		bind:value={
			() => valueStr,
			(_value) => {
				if (_value === '' && (allowDeselect ?? false)) {
					value = undefined
					return
				}
				const found = normalizedItems.find(
					(item) => String(item.id) === String(_value),
				)
				if (found !== undefined) value = found.item
			}
		}
		{disabled}
		{name}
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
			<option value="" disabled={!(allowDeselect ?? false)}>{placeholder}</option>
		{/if}

		{#if normalizedGroups.length > 0}
			{#each normalizedGroups as group (group.id)}
				<optgroup label={group.label}>
					{#each group.items as item (item.id)}
						<option value={String(item.id)} disabled={item.disabled}>
							{#if Item}
								{@render Item(item.item, String(item.id) === valueStr)}
							{:else}
								{item.label}
							{/if}
						</option>
					{/each}
				</optgroup>
			{/each}
		{:else}
			{#each normalizedItems as item (item.id)}
				<option value={String(item.id)} disabled={item.disabled}>
					{#if Item}
						{@render Item(item.item, String(item.id) === valueStr)}
					{:else}
						{item.label}
					{/if}
				</option>
			{/each}
		{/if}
	</select>
{/if}
