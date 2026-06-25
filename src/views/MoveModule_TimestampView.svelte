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
		'$module',
		'source',
		{
			label: 'ledger/package version',
		},
	],
	content: {
		dl: [
			[
				'$module',
				'source',
				'timestampMs',
				'ledgerVersion',
				'packageVersion',
				'packageDigest',
			],
			[
				{
					label: 'bytecode availability',
				},
				'abi',
				{
					label: 'source availability',
				},
				'sourceDigest',
				'$$functions',
				'$$structs',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Module',
				items: [
					{
						label: 'parent Move module',
					},
				],
			},
			{
				label: 'Functions',
				items: [
					{
						label: 'function rows for parsed ABI',
					},
				],
			},
			{
				label: 'Structs',
				items: [
					{
						label: 'struct rows for parsed ABI',
					},
				],
			},
			{
				label: 'Bytecode/ABI/source',
				items: [
					{
						label: 'raw bytecode',
					},
					{
						label: 'ABI JSON',
					},
					{
						label: 'source text/digest',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Aptos fullnode module response',
					},
					{
						label: 'Aptos indexer module payload',
					},
					{
						label: 'Sui package object/version/normalized module payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'functions',
			label: 'functions',
			field: '$$functions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'structs',
			label: 'structs',
			field: '$$structs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.MoveModule_Timestamp>
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
	entityType={EntityType.MoveModule_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
