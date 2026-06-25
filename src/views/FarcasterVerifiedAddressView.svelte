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
		'fid',
		'protocol',
		'address',
	],
	content: {
		dl: [
			[
				'fid',
				'protocol',
				'address',
				'$user',
				'$evmAccount',
				'$solanaAccount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'User',
				items: [
					{
						label: 'parent Farcaster user',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'EVM or Solana account when refs are resolved',
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterVerifiedAddress>
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
	entityType={EntityType.FarcasterVerifiedAddress}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
