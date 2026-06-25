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
		'schemaUid',
		{
			label: 'schema string',
		},
		'resolver',
	],
	content: {
		dl: [
			[
				'schemaUid',
				'$network',
				{
					label: 'schema string',
				},
				'resolver',
				'revocable',
				'registerer',
				{
					label: 'registered time',
				},
			],
			[
				{
					label: 'registered transaction/log',
				},
				{
					label: 'attestation count when indexed',
				},
				'$resolverContract',
				'$registererAccount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Attestations',
				items: [
					{
						label: 'attestations filtered by schema',
					},
				],
			},
			{
				label: 'Resolver',
				items: [
					{
						label: 'resolver EVM contract when nonzero',
					},
				],
			},
			{
				label: 'Registerer',
				items: [
					{
						label: 'registerer EVM network account',
					},
				],
			},
			{
				label: 'Schema fields',
				items: [
					{
						label: 'parsed ABI-style schema segments',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'SchemaRegistry getSchema',
					},
					{
						label: 'Registered log',
					},
					{
						label: 'deployment artifact/version',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'attestations',
			label: 'attestations',
			field: '$$attestations',
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
			selection: EntityProxyResource<typeof schema, EntityType.EasSchema>
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
	entityType={EntityType.EasSchema}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
