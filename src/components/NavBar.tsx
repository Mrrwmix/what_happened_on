import { Button, Container, Navbar } from "react-bootstrap";

interface NavBarProps {
  showBack?: boolean;
  showReset?: boolean;
  onBack?: () => void;
  onReset?: () => void;
}

const NavBar = ({
  showBack = false,
  showReset = false,
  onBack,
  onReset,
}: NavBarProps) => {
  // If no buttons to show, don't render the navbar
  if (!showBack && !showReset) {
    return null;
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
        <Container fluid className="d-flex justify-content-between">
          <div>
            {showBack && (
              <Button variant="outline-light" onClick={onBack}>
                Back
              </Button>
            )}
          </div>
          <div>
            {showReset && (
              <Button variant="outline-light" onClick={onReset}>
                Reset
              </Button>
            )}
          </div>
        </Container>
      </Navbar>
      <div data-testid="navbar-spacing" style={{ marginBottom: "60px" }} />
    </>
  );
};

export default NavBar;
