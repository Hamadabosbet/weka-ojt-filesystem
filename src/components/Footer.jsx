// Footer.js
import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container className="text-center">
        <div>
          <span className="text-muted">
            © 2024 CloudStore. All rights reserved.
          </span>
        </div>
        <div className="mt-2">
          <a href="https://cloudstore.com/about">About Us</a> |
          <a href="https://cloudstore.com/privacy"> Privacy Policy</a> |
          <a href="https://cloudstore.com/terms"> Terms of Service</a>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
