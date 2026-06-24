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
			label: 'regulated asset profile',
		},
		{
			label: 'power kind',
		},
		{
			label: 'actor key',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'regulated asset profile',
				},
				{
					label: 'power kind',
				},
				{
					label: 'actor key',
				},
				'source',
				{
					label: 'actor selector',
				},
				'scope',
				{
					label: 'ledger coordinate',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Profile',
				items: [
					{
						label: 'parent regulated asset profile',
					},
				],
			},
			{
				label: 'Actions',
				items: [
					{
						label: 'issuer actions attributed to this power',
					},
				],
			},
			{
				label: 'Evidence',
				items: [
					{
						label: 'role/member state',
					},
					{
						label: 'role events',
					},
					{
						label: 'owner/agent calls',
					},
					{
						label: 'mint authority',
					},
					{
						label: 'token keys',
					},
					{
						label: 'or verified ABI context',
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
			selection: EntityProxyResource<typeof schema, EntityType.IssuerPower>
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
	entityType={EntityType.IssuerPower}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
