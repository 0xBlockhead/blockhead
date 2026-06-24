<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		{
			label: 'asset instance',
		},
		{
			label: 'extension kind',
		},
		{
			label: 'scope',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'asset instance',
				},
				{
					label: 'extension kind',
				},
				{
					label: 'scope',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'authority selector',
				},
				{
					label: 'ledger coordinate',
				},
				{
					label: 'config summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Asset',
				items: [
					{
						label: 'parent asset instance',
					},
				],
			},
			{
				label: 'Config',
				items: [
					{
						label: 'decoded extension config',
					},
				],
			},
			{
				label: 'Authority',
				items: [
					{
						label: 'account/EVM account/Solana account when resolved',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw mint/account/contract/metadata payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TokenProgramExtension_Timestamp>
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
	entityType={EntityType.TokenProgramExtension_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
