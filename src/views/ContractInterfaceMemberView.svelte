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
			label: 'member kind',
		},
		'name',
		{
			label: 'canonical signature',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'member kind',
				},
				'name',
				{
					label: 'canonical signature',
				},
				{
					label: 'selector or topic0',
				},
				'inputs',
				'outputs',
				{
					label: 'state mutability',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Interface',
				items: [
					{
						label: 'interface id',
					},
					{
						label: 'member key',
					},
					{
						label: 'member kind',
					},
				],
			},
			{
				label: 'ABI shape',
				items: [
					'name',
					{
						label: 'canonical signature',
					},
					'inputs',
					'outputs',
					{
						label: 'state mutability',
					},
				],
			},
			{
				label: 'Hash refs',
				items: [
					'selector',
					{
						label: 'topic0',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'verified ABI JSON',
					},
					{
						label: 'checked-in interface catalogs',
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
			selection: EntityProxyResource<typeof schema, EntityType.ContractInterfaceMember>
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
	entityType={EntityType.ContractInterfaceMember}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
