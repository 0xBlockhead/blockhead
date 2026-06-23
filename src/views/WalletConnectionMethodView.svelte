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
			'id',
			'label',
			'protocol',
			{
				label: 'implementation status',
			},
		],
		content: {
			dl: [
				[
					'id',
					'label',
					'protocol',
					{
						label: 'discovery kind',
					},
					{
						label: 'transport kind',
					},
					{
						label: 'API surface',
					},
					{
						label: 'session kind',
					},
				],
				[
					{
						label: 'authorization kind',
					},
					{
						label: 'account exposure kind',
					},
					{
						label: 'request execution kind',
					},
					{
						label: 'dependency policy',
					},
					{
						label: 'implementation status',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Capabilities',
					items: [
						{
							label: 'source capability matrix',
						},
						{
							label: 'runtime capability matrix',
						},
					],
				},
				{
					label: 'Namespaces',
					items: [
						{
							label: 'NetworkNamespace coverage',
						},
						{
							label: 'CAIP namespace coverage',
						},
					],
				},
				{
					label: 'Runtime mapping',
					items: [
						{
							label: 'adapter id',
						},
						{
							label: 'source binding',
						},
						{
							label: 'minimum dependency',
						},
					],
				},
				{
					label: 'Source docs',
					items: [
						{
							label: 'standard/spec/provider documentation rows',
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
			selection: EntityProxyResource<typeof schema, EntityType.WalletConnectionMethod>
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
	entityType={EntityType.WalletConnectionMethod}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
