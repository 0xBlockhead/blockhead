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
		'$assetInstance',
		'standard',
		{
			label: 'latest profile state',
		},
	],
	content: {
		dl: [
			[
				'$assetInstance',
				'standard',
				{
					label: 'latest RegulatedAssetProfile_Timestamp registry/control state',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State observations',
				items: [
					{
						label: 'RegulatedAssetProfile_Timestamp list',
					},
				],
			},
			{
				label: 'Claim requirements',
				items: [
					{
						label: 'ClaimTopicRequirement list',
					},
				],
			},
			{
				label: 'Trusted issuers',
				items: [
					{
						label: 'TrustedIssuer list',
					},
				],
			},
			{
				label: 'Compliance modules',
				items: [
					{
						label: 'ComplianceModule list',
					},
				],
			},
			{
				label: 'Issuer powers',
				items: [
					{
						label: 'IssuerPower list',
					},
				],
			},
			{
				label: 'Restrictions',
				items: [
					{
						label: 'TransferRestriction list',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'issuer-powers',
			label: 'issuer powers',
			field: '$$issuerPowers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'claim-requirements',
			label: 'claim requirements',
			field: '$$claimRequirements',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'trusted-issuers',
			label: 'trusted issuers',
			field: '$$trustedIssuers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'compliance-modules',
			label: 'compliance modules',
			field: '$$complianceModules',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'restrictions',
			label: 'restrictions',
			field: '$$restrictions',
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
			selection: EntityProxyResource<typeof schema, EntityType.RegulatedAssetProfile>
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
	entityType={EntityType.RegulatedAssetProfile}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
