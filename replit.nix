{ pkgs }: {
  deps = [
    pkgs.incus
    pkgs.openssh_gssapi
    pkgs.mailutils
    pkgs.cowsay
  ];
}