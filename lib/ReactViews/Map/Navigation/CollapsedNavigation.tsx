import { autorun } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import ViewState from "../../../ReactViewModels/ViewState";
import CloseButton from "../../Generic/CloseButton";
import { PrefaceBox } from "../../Generic/PrefaceBox";
import { StyledIcon } from "../../Icon";
import { useTranslationIfExists } from "./../../../Language/languageHelpers";
import { filterViewerAndScreenSize } from "./MapNavigation";
import { MapNavigationItemExtendedType } from "./MapNavigationItem";
const Box = require("../../../Styled/Box").default;
const BoxSpan = require("../../../Styled/Box").BoxSpan;

const Text = require("../../../Styled/Text").default;
const Spacing = require("../../../Styled/Spacing").default;

interface PropTypes {
  viewState: ViewState;
  items: MapNavigationItemExtendedType[];
}

const CollapsedNavigationBox = styled(Box).attrs({
  positionAbsolute: true,
  styledWidth: "500px",
  styledMaxHeight: "320px",
  backgroundColor: "white",
  rounded: true,
  paddedRatio: 4,
  overflowY: "auto",
  scroll: true
})`
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.12), 0 10px 20px 0 rgba(0, 0, 0, 0.05);
  @media (max-width: ${props => props.theme.mobile}px) {
    width: 100%;
  }
`;

const ButtonsBox = styled(Box).attrs({})`
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  position: relative;
  margin-bottom: 10px;
  gap: 20px;
`;

const NavigationButton = styled(BoxSpan).attrs({
  boxShadow: true,
  centered: true,
  rounded: true
})`
  cursor: pointer;
  &:hover {
    border: 2px solid ${p => p.theme.darkWithOverlay};
    svg {
      opacity: 0.9;
    }
  }
  :before {
    content: "";
    display: block;
    height: 0;
    width: 0;
    padding-bottom: 100%;
  }
`;

const CollapsedNavigationPanel: React.FC<PropTypes> = observer(
  (props: PropTypes) => {
    const { viewState } = props;
    const theme = useTheme();
    const { t } = useTranslation();
    let items = props.items;
    return (
      <CollapsedNavigationBox column>
        <CloseButton
          color={theme.darkWithOverlay}
          topRight
          onClick={() => viewState.closeCollapsedNavigation()}
        />
        <Text extraExtraLarge bold textDarker>
          {t("mapNavigation.additionalTools")}
        </Text>
        <Spacing bottom={5} />
        <ButtonsBox>
          {items.map(item => (
            <NavigationButton
              key={item.id}
              title={useTranslationIfExists(item.name)}
              onClick={() => {
                viewState.closeCollapsedNavigation();
                viewState.terria.mapNavigationModel.activateItem(item.id);
                if (item.onClick) {
                  item.onClick();
                }
              }}
              css={
                item.mapIconButtonProps &&
                item.mapIconButtonProps.primary &&
                `
                border: 2px solid ${theme.colorPrimary};
              `
              }
            >
              <StyledIcon glyph={item.glyph} styledWidth="22px" dark />
            </NavigationButton>
          ))}
        </ButtonsBox>
      </CollapsedNavigationBox>
    );
  }
);

const CollapsedNavigationDisplayName = "CollapsedNavigation";
const CollapsedNavigation: React.FC<{ viewState: ViewState }> = observer(
  ({ viewState }) => {
    useEffect(() =>
      autorun(() => {
        if (
          viewState.showCollapsedNavigation &&
          viewState.topElement !== CollapsedNavigationDisplayName
        ) {
          viewState.setTopElement(CollapsedNavigationDisplayName);
        }
      })
    );

    let items = viewState.terria.mapNavigationModel.collapsedItems;
    items = items.filter(item => filterViewerAndScreenSize(item, viewState));

    if (!viewState.showCollapsedNavigation || items.length === 0) {
      viewState.closeCollapsedNavigation();
      return null;
    }

    return (
      <>
        <PrefaceBox
          onClick={() => viewState.closeCollapsedNavigation()}
          role="presentation"
          aria-hidden="true"
          pseudoBg
        ></PrefaceBox>
        <CollapsedNavigationPanel
          viewState={viewState}
          items={items}
        ></CollapsedNavigationPanel>
      </>
    );
  }
);

export default CollapsedNavigation;
