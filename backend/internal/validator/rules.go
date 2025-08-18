package validator

import (
	"regexp"
	"strings"
)

var domainRegex = regexp.MustCompile(`^[a-zA-Z0-9.-]+$`)

func (v *Validator) ValidateEmail(email string) {
	v.Check(email != "", "email", "must be provided")
	v.Check(!strings.ContainsAny(email, "`'\"\\x00"), "email", "contains dangerous characters")
	v.Check(len(email) <= 254, "email", "must not be more than 254 bytes long")

	parts := strings.SplitN(email, "@", 2)

	v.Check(len(parts) == 2, "email", "must be in the format user@domain")
	if len(parts) != 2 {
		return
	}

	localPart := parts[0]
	domainPart := parts[1]

	v.Check(len(localPart) > 0, "email", "must have a local part")
	v.Check(len(localPart) <= 63, "email", "local part must not be more than 63 bytes long")

	v.Check(len(domainPart) > 0, "email", "must have a domain part")
	v.Check(domainRegex.MatchString(domainPart), "email", "domain part contains invalid characters")
}
