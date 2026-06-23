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
				label: 'contract address',
			},
			{
				label: 'script hash',
			},
			{
				label: 'code hash',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'contract address',
					},
					{
						label: 'script hash',
					},
					{
						label: 'code hash',
					},
					{
						label: 'script ref',
					},
					{
						label: 'latest balance',
					},
					{
						label: 'latest storage hash',
					},
					{
						label: 'entrypoint count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Script',
					items: [
						{
							label: 'Michelson script row',
						},
					],
				},
				{
					label: 'Entrypoints',
					items: [
						{
							label: 'contract entrypoint rows',
						},
					],
				},
				{
					label: 'Parameter/storage types',
					items: [
						{
							label: 'decoded Michelson types',
						},
					],
				},
				{
					label: 'Big maps',
					items: [
						{
							label: 'contract big maps',
						},
					],
				},
				{
					label: 'Operations',
					items: [
						{
							label: 'contract operations',
						},
					],
				},
				{
					label: 'Storage history',
					items: [
						{
							label: 'level/source contract storage observations',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'node/indexer payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosContract>
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
	entityType={EntityType.TezosContract}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
