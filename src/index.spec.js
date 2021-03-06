/* eslint-env jest */
import React from "react";
import renderer from "react-test-renderer";
import { Provider, translate, Translate } from "../macro";

const smallStrong = {
  small: <small />,
  strong: <strong />
};

function checkSnapshot(elt, { locale = "en", messages } = {}) {
  expect(
    renderer
      .create(
        <Provider locale={locale} messages={messages} defaultLocale="en">
          {elt}
        </Provider>
      )
      .toJSON()
  ).toMatchSnapshot();
}

describe("Translate", () => {
  it("Translates with JSX in values", () => {
    checkSnapshot(
      <Translate
        defaultMessage={`{nb, plural,
          one {<strong>singular</strong><small>jsx</small>}
          other {<strong>plural</strong><small>jsx</small>}
        }`}
        values={{ nb: 5 }}
        components={smallStrong}
      />
    );

    checkSnapshot(
      <Translate>
        <strong>bold</strong>
        <small>tiny</small>
      </Translate>
    );

    checkSnapshot(
      <Translate>
        <strong>bold</strong>
        <small>tiny</small>
      </Translate>,
      {
        locale: "fr",
        messages: {
          "<strong>bold</strong><small>tiny</small>":
            "<small>Tres petit</small><strong>gras</strong>"
        }
      }
    );
  });
});

describe("Translate", () => {
  it("Escapes JSX in values", () => {
    const strong = "<strong/>";
    checkSnapshot(<Translate components={smallStrong}>bob {strong}</Translate>);
    const details = "<details/>";
    checkSnapshot(
      <Translate components={smallStrong}>bob {details}</Translate>
    );

    checkSnapshot(<Translate components={smallStrong}>bob</Translate>);

    checkSnapshot(
      <Translate
        values={{ jsx: <strong /> }}
        defaultMessage="{jsx} in string"
      />
    );
  });

  it("Renders null on Error", () => {
    checkSnapshot(<Translate defaultMessage="<a></b>" />);
    checkSnapshot(<Translate defaultMessage="<a>" />);
    checkSnapshot(<Translate defaultMessage="</a>" />);
  });

  xit("Renders null on Error", () => {
    // FIXME This should render null
    checkSnapshot(<Translate defaultMessage="{a}}" />);
  });
});

describe("translate", () => {
  it("gives the correct result", () => {
    expect(
      translate("test {value}", {
        values: { value: 4 }
      })
    ).toEqual("test 4");
  });
});

describe("Dynamic translations", () => {
  it("Translates with dynamic key", () => {
    const name1 = "custom1";
    const name2 = "custom2";
    checkSnapshot(
      <>
        <Translate defaultMessage={name1} id={`dynamic.${name1}`} />
        <Translate defaultMessage={name2} id={`dynamic.${name2}`} />
      </>,
      {
        locale: "fr",
        messages: {
          "dynamic.custom1": "custom1 name",
          "dynamic.custom2": "custom2 name"
        }
      }
    );
  });
});
