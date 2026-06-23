<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		actions: [
			{
				id: 'copy-error-selector',
				label: 'Copy error selector',
				kind: 'copy',
				field: 'hex',
			},
		],
		transforms: [
			{
				id: 'error-selector-encodings',
				label: 'Error selector encodings',
				field: 'hex',
				kind: 'selectorEncoding',
				slot: 'ErrorSelectorEncodings',
			},
		],
		closed: [
			{
				label: 'selector hex',
			},
			{
				label: 'latest candidate signature',
			},
			{
				label: 'candidate count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'selector hex',
					},
					{
						label: 'latest candidate signature',
					},
					{
						label: 'latest source',
					},
					{
						label: 'candidate count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Catalog observations',
					items: [
						{
							label: 'timestamped candidate-signature lookups',
						},
					],
				},
				{
					label: 'ABI context',
					items: [
						{
							label: 'verified contract ABI requirement before authoritative decode',
						},
					],
				},
				{
					label: 'Catalog evidence',
					items: [
						{
							label: 'Openchain/Sourcify 4byte lookup payload',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmError>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.EvmError}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
