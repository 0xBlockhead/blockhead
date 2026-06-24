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
			label: 'grant id',
		},
		{
			label: 'authorization kind',
		},
		'issuer',
	],
	content: {
		dl: [
			[
				{
					label: 'grant id',
				},
				{
					label: 'authorization kind',
				},
				'issuer',
				'audience',
				{
					label: 'issued/not-before/expires/revoked timestamps',
				},
			],
			[
				{
					label: 'method count',
				},
				{
					label: 'resource count',
				},
				{
					label: 'proof kind',
				},
				{
					label: 'proof summary',
				},
				{
					label: 'raw grant presence',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Connection',
				items: [
					{
						label: 'BlockheadWalletConnection when derived from a session',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'BlockheadWalletAccount when scoped',
					},
				],
			},
			{
				label: 'Scope',
				items: [
					{
						label: 'redacted scope JSON',
					},
				],
			},
			{
				label: 'Proof',
				items: [
					{
						label: 'CACAO/ReCap/UCAN/SIWx/session-key/delegation proof summary',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletCapabilityGrant>
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
	entityType={EntityType.BlockheadWalletCapabilityGrant}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
