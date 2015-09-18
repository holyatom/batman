export default {
  errors: {
    // Common errors:
    unexpected_error: 'Unexpected API error',
    validation_failed: 'Validation failed',
    user_exist: 'User with same username exist',
    not_found: 'Resource not found',
    required: '%s is required',
    bad_boolean_value: 'Expected boolean value',
    bad_int_value: 'Expected integer number',
    bad_decimal_value: 'Expected decimal number',
    bad_token: 'Bad JSON Web Token',
    less_than_allowed: '%s is less than allowed',
    more_than_allowed: '%s is more than allowed',
    shorter_than_allowed: '%s is too short',
    longer_than_allowed: '%s is too long',
    invalid_date: 'Wrong format of date',
    auth_required: 'Authorization required',
    access_denied: 'Access denied',
    invalid_value: 'Invalid value',
    already_exists: '%s has already registered',
    non_existent: '%s doesn\'t exist',

    // Custom errors, users:
    bad_username: 'Wrong username',
    wrong_login_or_password: 'Invalid credentials',
    unknown_user: 'Unknown username',
    invalid_username: 'Bad or reserved username',

    // Following errors
    already_followed: 'User is already followed',
    not_followed: 'User is not followed',
    self_following: 'User tries to follow themselves',
    self_unfollowing: 'User tries to unfollow themselves',

    // Extra messages:
    alphanumeric: 'Alphanumeric symbols are allowed only'
  }
};
